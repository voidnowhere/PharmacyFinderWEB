import Header from "../../Header.jsx";
import Container from "react-bootstrap/Container";
import {Button, Form, Table} from "react-bootstrap";
import Footer from "../../Footer.jsx";
import {useEffect, useState} from "react";
import axiosInstance from "../../../axiosInstance.js";
import {Confirm} from "notiflix/build/notiflix-confirm-aio";
import {Notify} from "notiflix/build/notiflix-notify-aio";
import AddZone from "./AddZone.jsx";
import UpdateZone from "./UpdateZone.jsx";

function Zones() {
    const [cities, setCities] = useState([]);
    const [zones, setZones] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [currentCity, setCurrentCity] = useState(null);
    const [currentZone, setCurrentZone] = useState(null);

    useEffect(() => {
        getCities();
    }, []);

    useEffect(() => {
        if (currentCity !== null) {
            getZones();
        }
    }, [currentCity]);

    function getCities() {
        axiosInstance.get('api/v1/cities').then((response) => {
            setCities(response.data);
        });
    }

    function getZones() {
        axiosInstance.get(`api/v1/cities/${currentCity}/zones`).then((response) => {
            setZones(response.data);
        });
    }

    function deleteZone(zoneId) {
        Confirm.show(
            'Confirm',
            'Do you want to delete this zone?',
            'Yes',
            'No',
            () => {
                axiosInstance.delete(`api/v1/zones/${zoneId}`).then(() => {
                    getZones();
                    Notify.success('Zone deleted successfully', {position: "center-bottom"});
                });
            },
        );
    }

    return (
        <>
            <Header/>
            <Container className="mt-5">
                <Form.Select onChange={(e) => setCurrentCity(e.target.value)}>
                    <option hidden={true}>Select a city</option>
                    {cities.map((city) => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                </Form.Select>
                {
                    currentCity
                    &&
                    <Table striped hover className="mt-3">
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
                        {
                            zones ?
                                zones.map((zone) => (
                                    <tr key={zone.id}>
                                        <td>{zone.name}</td>
                                        <td className="d-flex gap-2">
                                            <Button variant="outline-success" size="sm"
                                                    onClick={() => setCurrentZone(zone.id)}>
                                                <i className="bi bi-pencil-square"></i>
                                            </Button>
                                            <Button variant="outline-danger" size="sm"
                                                    onClick={() => deleteZone(zone.id)}>
                                                <i className="bi bi-trash3-fill"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                                :
                                <></>
                        }
                        </tbody>
                    </Table>
                }
                {
                    showAdd
                    &&
                    <AddZone cityId={currentCity} show={showAdd} setShow={setShowAdd} getZones={getZones}/>
                }
                {
                    currentZone
                    &&
                    <UpdateZone zoneId={currentZone} setCurrentZone={setCurrentZone} getZones={getZones}/>
                }
            </Container>
            <Footer/>
        </>
    )
}

export default Zones;