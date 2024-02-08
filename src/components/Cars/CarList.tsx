import React, { useEffect, useState } from 'react';

import { LinearProgress, List, Pagination } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { PAGE_SIZE } from '../../common/consts';
import { ROLES } from '../../common/roles';
import { authStore } from '../../store/authStore';
import { brandModelsStore } from '../../store/brandModelsStore';
import { carsStore } from '../../store/carsStore';
import { ErrorSnack } from '../ErrorSnack';
import { Car } from '../model';
import '../styles.css';
import { AddCar } from './AddCar';
import { CarFilters } from './CarFilters';
import { CarListItem } from './CarListItem';
import { DeleteCar } from './DeleteCar';
import { EditCar } from './EditCar';
import { ROUTES } from '../../common/routes';
import { LogoutIfExpired } from '../Account/LogoutIfExpired';

export const CarList: React.FC = observer(() => {

  const [car, setCar] = useState<Car>({ carId: 0, brand: { carModelId: 0, brand: '', model: '' } });

  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const [carSearch, setCarSearch] = useState('');

  const [colorSearch, setColorSearch] = useState('');

  const [brandSearch, setBrandSearch] = useState('');

  const [modelSearch, setModelSearch] = useState('');

  const [page, setPage] = useState(1);

  function openDeleteModal(id: number) {
    const selectedCar = carsStore.cars.find(el => el.carId === id);

    if (selectedCar) {
      setCar(selectedCar);
      setIsOpenDeleteModal(true);
    }
  }

  function openEditModal(id: number) {
    const selectedCar = carsStore.cars.find(el => el.carId === id);

    if (selectedCar) {
      setCar(selectedCar);
      setIsOpenEditModal(true);
    }
  }

  let carFilteredList = carsStore.cars.filter(item => (((item.color ?? '').toLowerCase()).includes(colorSearch.toLowerCase()))
    && ((item.brand.brand.toLowerCase()).includes(brandSearch.toLowerCase())) 
    && ((item.brand.model.toLowerCase()).includes(modelSearch.toLowerCase())) 
    && (((item.brand.brand + ' ' + item.brand.model).toLowerCase()).includes(carSearch.toLowerCase())));


  const totalCount = carFilteredList.length;
  
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (totalPages < page && totalPages !== 0) {
    setPage(totalPages);
  }
  
  carFilteredList = carFilteredList.slice((page - 1) * PAGE_SIZE, (page) * PAGE_SIZE);
  console.log(carFilteredList.length);

  const carList = carFilteredList.map(carElem =>
    <CarListItem car={carElem} openEdit={openEditModal} openDelete={openDeleteModal} key={carElem.carId} />
  );

  useEffect(() => {
    carsStore.fetchCars();
    brandModelsStore.fetchBrandModels();
  }, [])

  return (
    <>
      <LogoutIfExpired/>

      <CarFilters filterCar={setCarSearch} filterColor={setColorSearch} filterBrand={setBrandSearch} filterModel={setModelSearch}/>

      {carsStore.loading && <LinearProgress/>}

      {brandModelsStore.fetchError && <ErrorSnack error={brandModelsStore.fetchError} />}
  
      {carsStore.fetchError && <ErrorSnack error={carsStore.fetchError} />}

      {authStore.checkRole([ROLES.Manager, ROLES.Admin, ROLES.SuperUser]) && <AddCar />}

      {!carsStore.fetchError && !carsStore.loading && !!totalCount && 
        <>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, num) => setPage(num)}/>
          <List>
            {carList}
          </List>
        </>}

      <DeleteCar car={car} isModalOpen={isOpenDeleteModal} onClose={() => setIsOpenDeleteModal(false)}/>

      <EditCar car={car} isModalOpen={isOpenEditModal} onClose={() => setIsOpenEditModal(false)}/>
    </>
  );
});