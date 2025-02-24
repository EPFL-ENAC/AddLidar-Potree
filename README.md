# Add Lidar Specs

## Project Overview

The **AddLidar Project** is a web-based system for **storing, processing, and visualizing LiDAR datasets** collected from airborne missions. The goal is to provide researchers with an **efficient pipeline** to access, process, and visualize large LiDAR datasets via a Kubernetes-based infrastructure.

The system consists of multiple components:

- **MMGIS**: A web interface for managing missions, allowing researchers to manually input mission metadata and file locations.
- **Potree**: A LiDAR visualization tool that loads pre-processed datasets from ENAC IT CDN.
- **API Wrapper**: A REST API that converts user queries into commands for the
- **LidarDataManager CLI:** A command-line tool for filtering, processing, and exporting LiDAR datasets.

Stockage :

- **NAS RCP**: The primary storage for raw LiDAR datasets.
- **ENAC IT CDN**: Stores optimized datasets converted by **Potree Converter**.
- **Kubernetes Infrastructure**: Hosts the API and ensures secure access to data.

## **Add Mission Workflow**

1. **Researcher Adds New Files (NAS RCP):**

   The researcher places new LiDAR files in the NAS RCP storage (e.g., `/LiDAR/0001_Mission_Root/...`).

2. **Enter Mission Metadata (MMGIS):**

   The researcher manually enters the mission’s metadata into **MMGIS**, including:

   - Mission footprint in GeoJSON
   - Flight date
   - File path referencing the newly added LiDAR files on NAS RCP

3. **Conversion & Upload (Potree Converter to ENAC IT CDN):**
   - A batch job triggers **Potree Converter** once the new mission is registered in MMGIS. **TO DISCUSS**
   - **Potree Converter** processes the LiDAR files and uploads the optimized dataset (e.g., `octree.bin`, `metadata.json`) to **ENAC IT CDN**, stored under a path like `enacit4r-cdn.epfl.ch/AddLidar/{ID_NAME}/`.
4. **Mission Ready for Visualization:**
   - **MMGIS** now includes a mission link pointing to the **Potree** web interface.
   - Users can follow this link to view the newly added LiDAR dataset in Potree.

## **Explore Missions Workflow**

1. **Dataset Selection (MMGIS / Potree):**
   - A user browses the mission list in **MMGIS** and selects a mission.
   - The system provides a link to **Potree** for visualization.
2. **Visualization (Potree from ENAC IT CDN):**
   - **Potree** loads the pre-processed LiDAR files directly from **ENAC IT CDN** (e.g., `enacit4r-cdn.epfl.ch/AddLidar/{ID_NAME}/octree.bin`).
   - The user can explore the dataset through Potree’s 3D viewer (pan, zoom, measure, etc.).
3. **Request Processed Dataset (Potree Download Form):**
   - Within Potree, the user can fill out the **download form** (filters, density, output format, ROI, etc.).
   - Submitting the form sends these parameters as a request to the **API Wrapper** (REST endpoint).
4. **On-Demand Processing (API Wrapper & LidarDataManager CLI):**
   - **API Wrapper** receives the request, parses it, and translates it into a **LidarDataManager CLI** command.
   - Since the CLI has read-only access to NAS RCP via a **Persistent Volume Claim (PVC)**, it executes the requested data transformation and returns a processed LiDAR file.
5. **Download Processed Data:**
   - The **API Wrapper** responds with the processed dataset.
   - The user downloads the customized file through Potree’s interface.
   - Progress bar ? Depending on performance of the CLI, a job queue or not.

## Architecture

### **MMGIS** ([AddLidar-MMGIS](https://addlidar-mmgis-dev.epfl.ch/))

- Provides a user interface where researchers **manually input mission metadata**.
- Each mission contains:
  - **Footprint data** (GeoJSON format).
  - **Date of flight**.
  - **Relative path** to the dataset stored in **NAS RCP** (e.g., `/LiDAR/0001_Mission_Root/02_LASPCD/test_blk_07_classified_full_density.las`).
- When a new mission is added, a **Job** must be executed to process the dataset with **Potree Converter** and store the converted files in **ENAC IT CDN**.
- Provides mission links that point to **Potree**, enabling visualization of the dataset.

### **Potree** ([AddLidar-Potree](https://addlidar-potree.epfl.ch/) | [GitHub](https://github.com/EPFL-ENAC/AddLidar-Potree))

- **Visualizes LiDAR datasets** using **Octree-based rendering**.
- Loads datasets **directly from ENAC IT CDN** (e.g., `enacit4r-cdn.epfl.ch/AddLidar/{ID_NAME}/octree.bin`).
- Provides a **download form**, allowing users to request processed versions of the dataset.

### **API Wrapper** ([GitHub](https://github.com/EPFL-ENAC/AddLidar-API))

- Runs a **REST API** that:
  - Parses **URL query parameters** from the **Potree download form**.
  - Converts queries into **LidarDataManager CLI** commands.
  - Mounts the NAS storage via **Persistent Volume Claim (PVC)** to access datasets.
  - Provides processed **LiDAR dataset downloads** based on user-selected parameters.
- **Storage Access**:
  - The **PVC is read-only** and **only accessible from the API Wrapper**.

### **NAS RCP (LiDAR Storage)**

- Primary storage server hosting all **raw LiDAR datasets**.
- Organized into mission-specific folders following the format: `ID_NAME/`.
- Contains multiple data subdirectories:
  - **Raw data (`00_Raw_Lidar_SDC_Data/`)**
  - **Processed data (`02_LASPCD/`)**
  - **Metadata (`09_LAZ_FootPrints/`)**
- Example file path: `/LiDAR/0001_Mission_Root/02_LASPCD/test_blk_07_classified_full_density.las`

### **ENAC IT CDN (Processed LiDAR Storage)**

- Stores **Potree-processed datasets** for efficient web-based visualization.
- Example file paths:
  - `enacit4r-cdn.epfl.ch/AddLidar/{ID_NAME}/octree.bin`
  - `enacit4r-cdn.epfl.ch/AddLidar/{ID_NAME}/metadata.json`

### **LidarDataManager CLI** ([GitLab](https://gitlab.epfl.ch/topo/lidardatamanager))

- Command-line tool for **filtering, transforming, and exporting LiDAR data**.
- Used by the **API Wrapper** to process datasets on demand.
- Supports:
  - Filtering attributes.
  - Converting between formats (PCD, LAS v1.4, etc.).
  - Selecting subsets of points (ROI, density filtering).
  - Coordinate system transformations.
- Example usage:
  ```
  ./lidarDataManager --format=lasv14 --density=10.0 --roi="100,200,300,50,50,50,0,0,0" --outcrs="EPSG:2056" /path/to/dataset.las
  ```

### **Kubernetes Infrastructure**

- Hosts the **API Wrapper** and **Persistent Volume Claim (PVC)**.
- **PVC Access**:

  - Mounts `smb://enac-nas1.rcp.epfl.ch/fts-addlidar/LiDAR/`.
  - Access is **read-only** and limited to the **API Wrapper**.

- **Plant ULM definition :**

```
  @startuml
  !pragma teoz true
  title AddLidar - High-Level Architecture
  skinparam componentStyle uml2
  skinparam component {
  BackgroundColor<<K8S>> #F1F4FF
  BackgroundColor<<Storage>> #F9F9F9
  BackgroundColor<<Web>> #FFFCEF
  BackgroundColor<<Service>> #EFFFEF
  BorderColor #999999
  FontColor #333333
  }
  rectangle "Kubernetes" <<K8S>> as K8S {
  component "API Wrapper" <<Service>> as API
  component "LidarDataManager CLI" <<Service>> as CLI
  note bottom of API
  • Exposes REST endpoints
  • Translates user requests into CLI commands
  • Connects to read-only PVC
  end note
  note bottom of CLI
  • Command-line LiDAR processing
  • Called by API Wrapper
  • Reads from NAS via PVC
  end note
  }
  rectangle "External Storage" <<Storage>> as EXT {
  folder "NAS RCP\n(Raw LiDAR)" <<Storage>> as NAS
  folder "ENAC IT CDN\n(Processed LiDAR)" <<Storage>> as CDN
  }
  component "MMGIS" <<Web>> as MMGIS
  component "Potree" <<Web>> as Potree
  ' Relationships
  MMGIS -[hidden]-> NAS
  MMGIS -[hidden]-> Potree
  Potree -[hidden]-> CDN
  Potree -[hidden]-> API
  API -[hidden]-> CLI
  CLI -[hidden]-> NAS
  API -[hidden]-> CDN
  ' Render visible lines with labels
  MMGIS --> NAS : 1) Path references\nRaw LiDAR
  MMGIS --> Potree : 2) Link to 3D viewer
  Potree --> CDN : Loads pre-processed\noctree data
  Potree --> API : Requests on-demand\nprocessing
  API --> CLI : Translates REST calls\nto CLI commands
  CLI --> NAS : Reads raw LiDAR\n(read-only via PVC)
  API --> CDN : (Optional) Upload or\nupdate processed data
  Potree <-- API : Returns processed\nLiDAR for download
  @enduml
```
