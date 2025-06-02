# Changelog

## [0.2.0](https://github.com/EPFL-ENAC/AddLidar-Potree/compare/v0.1.0...v0.2.0) (2025-06-02)


### Features

* add clip box connection between potree & vue js ([e92ccc4](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/e92ccc42e275971b31e33fdc95ed12c8c3723286))
* add clip volume component mimicking potree clip volume ([5af502f](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/5af502f7f7e9307e91933c3e3501b6e1572487f6))
* add filter range source id ([649e2ba](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/649e2baa246df16354f0af799c5499079945a2d6))
* add gap to download card layout for improved spacing ([246a714](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/246a7149d3ab3b0418027118cf5b46d320c4ae72))
* add job api with websocket connection [#4](https://github.com/EPFL-ENAC/AddLidar-Potree/issues/4) ([e3ff357](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/e3ff35753cfb080806c80ecee93cc2b7322da723))
* add Source ID filtering functionality ([cd6496b](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/cd6496b1807c7ae1d58f6a49cf61e89d174a067a))
* added clip volume parameters inside downloading data form ([09d7abe](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/09d7abee7e28170ec8fbf5eb811bc2ae3839111c))
* adjust FOV and point budget settings in PointCloudViewer ([08ddd00](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/08ddd0086a07b047d8c0b17da45714cf711a1997))
* enhance directory store with pointcloud metadata fetching and update related components ([de2947a](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/de2947a9ea1576f7e38d299ca7b78f7d180bb475))
* enhance download functionality with new processing panel and improved UI ([8209f44](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/8209f44d8fca7d78a911aa41526669da1fd2cc7e))
* enhance DownloadDataForm with additional input fields and loading state for download process ([f0b0466](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/f0b0466a73014d84180b3c7f78b04ab47459dc13))
* enhance README with collapsible Plant UML definition ([d83141f](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/d83141f9929f01bac69e8c29f78f1b2df1a69ed8))
* implement directory store and routing for mission data ([6042aaa](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/6042aaad4ab68cc21022404aeec7b5e373cdf0ee))
* improve readme ([c750057](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/c75005739e295bc53e6be0bada233e7f5e36ef7a))
* make color variables selector in expansion item ([c68ccd3](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/c68ccd325c5c59b432bf31e818f116617f98b08c))
* reimplemented color variable ([509da28](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/509da287cccb800b30e1a7ade5ea762034e3acf4))
* set download logic for mvp - only format selection ([14d5ee9](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/14d5ee9f92269dfb25acc600f1769dfdc0ba41cb))
* **static:** add tree static files component with download files button ([08e0220](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/08e0220ae2d1bb50915c6ba3ec276c1ec3b7dd63))
* update active attribute assignment in loadPointCloud function ([4850778](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/4850778b410788d9e0b533f63ef18164e226a0f2))
* update build script names for clarity and add dense attribute to checkboxes in SourceIDFilter ([f0f72b9](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/f0f72b9fb608b744043ee649bfe7dd804e3248c9))
* update DownloadDataForm with new input fields and improved download logic ([9268a8d](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/9268a8d1aee1002da256ab7a086e01384f84caf2))
* update LidarDirectoryTree to nested tree ([26adc07](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/26adc07947de1b6ecc614610b763afa4571831af))
* update ROI parameter to use an array format in DownloadDataForm and JobParams ([d58ddb6](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/d58ddb669af498bb8dfd00330509e04f8a42e2e8))


### Bug Fixes

* bind max prop to range-filter in DownloadDataForm for proper functionality ([ccdc256](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/ccdc25615d6c6868ce13f3715f850c49cfedd136))
* comment yet not implemented file format in api ([cc384a4](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/cc384a468e69b6be9c22a69186d5363e82cc23ef))
* remove /LiDAR path from updating pv ([4a7a9a1](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/4a7a9a1ae3c9afd98e1f7d80dc189769b39abe4c))
* sync npm shrinkwrap ([ba1ced0](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/ba1ced0c789d8fa77014b438cc7a0975022daab2))
* update button label in DownloadDataForm for clarity ([9a9399b](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/9a9399bdb9d08bade107e7376245ec255818409d))
* use filename from URL parameters for download file path ([658fabd](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/658fabdc5df72d95f282996d7adf4b143ada2862))

## Changelog

### Features

- add download data form ([6b4755f](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/6b4755f69878d42a430374fd0ec4255392ae35a5))
- add ErrorMessage component for displaying error messages in PointCloudViewer ([e7d6172](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/e7d6172540d4611976cfd64d569e98f7a582d947))
- add first view position close to lidar points ([9c2c48b](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/9c2c48b9e7a9ef3861f4f6102197f699517beb18))
- add input to select attribute variable name to display color ([cc30cf8](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/cc30cf8f121853980240d459623e7ae433ddeaba))
- add new variables for radio button color variable ([95ec160](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/95ec160b599965ab245b631716bf56ca6f3321a8))
- added quasar ([0a3307f](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/0a3307f902e6f4960bc1573b2619755bd7745113))
- added vue app and integrate potree inside ([7f2349f](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/7f2349f6765200958bda922cd4600057f95d56b6))
- clean repo & remove add_lidar prefix for html files ([a54011b](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/a54011bd404094aaf4265765ad0c0bbc56d95955))
- update dockerfile + GitHub Actions workflow for deployment and add TODO file ([06348a2](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/06348a2cfafa622e9e71fc1a5deba755d0c66af7))
- update readme to the project ([8930dc2](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/8930dc2d2479e4cee69e512333c3930b0b67cb68))
- clean repo & remove add_lidar prefix for html files

### Bug Fixes

- remove points clouds folder copy from dockerfile ([9bbc4fa](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/9bbc4fa8add5abcad045b5abea0d60927f191571))
- **addlidar:** add page.html as / ([f97d1e0](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/f97d1e06f4c4e5a3a49ace29f01038e61745cedf))
- remove version for scripts ([00ac91f](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/00ac91f5ed4113f065997e9081b0b1884de7ecad))
- update Makefile to remove no-cache option and change nginx root page ([2e573ac](https://github.com/EPFL-ENAC/AddLidar-Potree/commit/2e573ac78f0ae7c0907668054de4af15aaf7ada3))
