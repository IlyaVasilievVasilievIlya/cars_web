import React, { useEffect, useState } from 'react';

import { LinearProgress, List, Pagination } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { PAGE_SIZE } from '../../common/consts';
import { ROLES } from '../../common/roles';
import { authStore } from '../../store/authStore';
import { brandModelsStore } from '../../store/brandModelsStore';
import { carsStore } from '../../store/carsStore';
import { LogoutIfExpired } from '../Account/LogoutIfExpired';
import { ErrorSnack } from '../ErrorSnack';
import { Car } from '../model';
import '../styles.css';
import { AddCar } from './AddCar';
import { CarFilters } from './CarFilters';
import { CarListItem } from './CarListItem';
import { DeleteCar } from './DeleteCar';
import { EditCar } from './EditCar';

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

  const carList = carsStore.cars.map(carElem =>
    <CarListItem car={carElem} openEdit={openEditModal} openDelete={openDeleteModal} key={carElem.carId} />
  );

  useEffect(() => {
    carsStore.fetchCars({
      pageNumber: page, 
      pageSize: PAGE_SIZE, 
      carName: carSearch, 
      color: colorSearch, 
      model: modelSearch, 
      brand: brandSearch});

    brandModelsStore.fetchBrandModels();
  }, [colorSearch, modelSearch, carSearch, brandSearch, page])

  return (
    <>
      <LogoutIfExpired/>

      <CarFilters filterCar={setCarSearch} filterColor={setColorSearch} filterBrand={setBrandSearch} filterModel={setModelSearch}/>

      {carsStore.loading && <LinearProgress/>}

      {brandModelsStore.fetchError && <ErrorSnack error={brandModelsStore.fetchError} />}
  
      {carsStore.fetchError && <ErrorSnack error={carsStore.fetchError} />}

      {authStore.checkRole([ROLES.Manager, ROLES.Admin, ROLES.SuperUser]) && <AddCar />}


      {!carsStore.fetchError && !carsStore.loading && !!carsStore.pagination?.TotalPages &&
        <>
          <Pagination
            count={carsStore.pagination?.TotalPages}
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