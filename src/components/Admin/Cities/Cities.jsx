import Header from "../../Header.jsx";
import Footer from "../../Footer.jsx";
import {useEffect, useState} from "react";
import axiosInstance from "../../../axiosInstance.js";
import Container from "react-bootstrap/Container";
import {Button, Table} from "react-bootstrap";
import AddCity from "./AddCity.jsx";
import UpdateCity from "./UpdateCity.jsx";
import {Confirm} from 'notiflix/build/notiflix-confirm-aio';
import {Notify} from 'notiflix/build/notiflix-notify-aio';

function Cities() {
    const [cities, setCities] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [currentCity, setCurrentCity] = useState(null);

    useEffect(() => {
        getCities();
    }, []);

    function getCities() {
        axiosInstance.get('api/v1/cities').then((response) => {
            setCities(response.data);
        });
    }

    function deleteCity(cityId) {
        Confirm.show(
            'Confirm',
            'Do you want to delete this city?',
            'Yes',
            'No',
            () => {
                axiosInstance.delete(`api/v1/cities/${cityId}`).then(() => {
                    getCities();
                    Notify.success('City deleted successfully', {position: "center-bottom"});
                });
            },
        );
    }

    return (
        <>
            <Header/>
            <Container className="mt-5">
                <Table striped hover>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>
                            <Button variant="outline-primary" size="sm" onClick={() => setShowAdd(true)}>
                                <i className="bi bi-plus-circle-fill"></i>
                            </Button>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {cities.map((city) => (
                        <tr key={city.id}>
                            <td>{city.name}</td>
                            <td className="d-flex gap-2">
                                <Button variant="outline-success" size="sm" onClick={() => setCurrentCity(city.id)}>
                                    <i className="bi bi-pencil-square"></i>
                                </Button>
                                <Button variant="outline-danger" size="sm" onClick={() => deleteCity(city.id)}>
                                    <i className="bi bi-trash3-fill"></i>
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                {
                    showAdd
                    &&
                    <AddCity show={showAdd} setShow={setShowAdd} getCities={getCities}/>
                }
                {
                    currentCity
                    &&
                    <UpdateCity cityId={currentCity} setCurrentCity={setCurrentCity} getCities={getCities}/>
                }
            </Container>
            <Footer/>
        </>
    )
}

export default Cities;