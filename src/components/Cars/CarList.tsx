import React, { useState, useEffect } from 'react';

import '../styles.css';
import { EditCar } from './EditCar';
import { ErrorMessage } from '../ErrorMessage';
import { observer } from 'mobx-react-lite';
import { carsStore } from '../../store/carsStore';
import { Car } from '../model';
import { AddCar } from './AddCar';
import { List } from '@mui/material';
import { authStore } from '../../store/authStore';
import { ROLES } from '../../public/consts';
import { DeleteCar } from './DeleteCar';
import { useNavigate } from 'react-router-dom';
import { CarFilters } from './CarFilters';
import { CarListItem } from './CarListItem';

export const CarList: React.FC = observer(() => {

  const [car, setCar] = useState<Car>({ carId: 0, brand: { carModelId: 0, brand: '', model: '' } });

  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const [carSearch, setCarSearch] = useState('');

  const [colorSearch, setColorSearch] = useState('');

  const [brandSearch, setBrandSearch] = useState('');

  const [modelSearch, setModelSearch] = useState('');

  const navigate = useNavigate();

  if (authStore.errorCode === 401) {
    navigate("/login");
  }

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

  const carFilteredList = carsStore.cars.filter(item => (((item.color ?? '').toLowerCase()).includes((colorSearch ? colorSearch : '').toLowerCase()))
    && ((item.brand.brand.toLowerCase()).includes((brandSearch ? brandSearch : '').toLowerCase())) 
    && ((item.brand.model.toLowerCase()).includes((modelSearch ? modelSearch : '').toLowerCase())) 
    && (carSearch === '' 
      || ((item.brand.brand + ' ' + item.brand.model).toLowerCase()).includes(carSearch.toLowerCase())));


  const carList = carFilteredList.map(carElem =>
    <CarListItem car={carElem} openEdit={openEditModal} openDelete={openDeleteModal} />
  );


  useEffect(() => {
    carsStore.fetchCars();
  }, [])

  return (
    <>
      <CarFilters filterCar={setCarSearch} filterColor={setColorSearch} filterBrand={setBrandSearch} filterModel={setModelSearch}/>

      {carsStore.fetchError && <ErrorMessage error={carsStore.fetchError} />}

      {authStore.checkRole([ROLES.Manager, ROLES.Admin, ROLES.SuperUser]) && <AddCar />}

      {!carsStore.fetchError && <List>
        {carList}
      </List>}

      {isOpenDeleteModal && <DeleteCar car={car} onDone={() => setIsOpenDeleteModal(false)} />}

      {isOpenEditModal && <EditCar car={car} onDone={() => setIsOpenEditModal(false)} />}
    </>
  );
});