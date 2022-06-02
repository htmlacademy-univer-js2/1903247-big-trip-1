import HeaderInfoView from './view/header-info-view';
import SiteMenuView from './view/site-menu-view';
import { render, renderPosition } from './render';
import { generatePoint } from './mock/point';
import TripPresenter from './presenter/Trip-presenter';
import PointsModels from './model/points-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/Filter-presenter';
import { MenuItem } from './const';


const POINT_COUNT = 4;
const points = Array.from({ length: POINT_COUNT }, generatePoint);

const tripBody = document.querySelector('.page-body');
const headerMenu = tripBody.querySelector('.trip-main');
const siteMenuElement = tripBody.querySelector('.trip-controls__navigation');
const mainContainer = tripBody.querySelector('.trip-events');
const siteMenuComponent = new SiteMenuView();

const pointsModel = new PointsModels();
pointsModel.points = points;

const filterModel = new FilterModel();

const tripPresenter = new TripPresenter(mainContainer, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMenuElement, filterModel);

const handlePointNewFormClose = () => {
  siteMenuComponent.element.querySelector(`[value=${MenuItem.TABLE}]`).disabled = false;
  siteMenuComponent.element.querySelector(`[value=${MenuItem.STATS}]`).disabled = false;
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
};

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_POINT:
      // Скрыть статистику
      // Показать фильтры
      tripPresenter.destroy();
      tripPresenter.init();
      tripPresenter.createNewPoint(handlePointNewFormClose);
      siteMenuComponent.element.querySelector(`[value=${MenuItem.TABLE}]`).disabled = true;
      siteMenuComponent.element.querySelector(`[value=${MenuItem.STATS}]`).disabled = true;
      break;
    case MenuItem.TABLE:
      // Показать фильтры
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      tripPresenter.init();
      // Скрыть статистику
      break;
    case MenuItem.STATS:
      // Скрыть фильтры
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      tripPresenter.destroy();
      // Показать статистику
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);


if (points.length !== 0) {
  render(headerMenu, new HeaderInfoView(points[0]).element, renderPosition.AFTERBEGIN);
}

render(siteMenuElement, siteMenuComponent, renderPosition.BEFOREEND);
//render(filtersElement, new FilterView(), renderPosition.BEFOREEND);

tripPresenter.init();
filterPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createNewPoint();
});
