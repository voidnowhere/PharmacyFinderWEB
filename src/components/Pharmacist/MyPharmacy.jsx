import Header from "../Header.jsx";
import Footer from "../Footer.jsx";
import {useEffect, useRef, useState} from "react";
import axiosInstance from "../../axiosInstance.js";
import Container from "react-bootstrap/Container";
import {Button, FloatingLabel, Form, Modal} from "react-bootstrap";
import {Notify} from 'notiflix/build/notiflix-notify-aio';
import {MapContainer, Marker, TileLayer, useMapEvent} from "react-leaflet";
import Disponibility from "./Disponibility.jsx";

function MyPharmacy() {
    const [showMap, setShowMap] = useState(false);
    const [showDisponibility, setShowDisponibility] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [cities, setCities] = useState([]);
    const [currentCity, setCurrentCity] = useState(-1);
    const [zones, setZones] = useState([]);
    const [currentZone, setCurrentZone] = useState(-1);
    const [pharmacyId, setPharmacyId] = useState(null);
    const nameRef = useRef();
    const addressRef = useRef();
    const phoneNumberRef = useRef();
    const latitudeRef = useRef();
    const longitudeRef = useRef();
    const [pharmacyPosition, setPharmacyPosition] = useState(null);

    useEffect(() => {
        axiosInstance.get('api/v1/cities').then((response) => {
            setCities(response.data);
        });
        axiosInstance.get("api/v1/pharmacies/my").then((response) => {
            setIsNew(response.data === '');
            if (response.data !== '') {
                setPharmacyId(response.data.id);
                setCurrentCity(response.data.cityId);
                setCurrentZone(response.data.zoneId);
                nameRef.current.value = response.data.name;
                addressRef.current.value = response.data.address;
                phoneNumberRef.current.value = response.data.phoneNumber;
                latitudeRef.current.value = response.data.latitude;
                longitudeRef.current.value = response.data.longitude;
                setPharmacyPosition([response.data.latitude, response.data.longitude]);
            }
        });
    }, []);

    useEffect(() => {
        if (currentCity !== null) {
            axiosInstance.get(`api/v1/cities/${currentCity}/zones`).then((response) => {
                setZones(response.data);
            });
        }
    }, [currentCity]);

    function submit(event) {
        event.preventDefault();
        if (isNew) {
            axiosInstance.post(`api/v1/zones/${currentZone}/pharmacies`, {
                name: nameRef.current.value.trim(),
                address: addressRef.current.value.trim(),
                phoneNumber: phoneNumberRef.current.value.trim(),
                latitude: latitudeRef.current.value.trim(),
                longitude: longitudeRef.current.value.trim(),
                zoneId: currentZone,
            }).then((response) => {
                setPharmacyId(response.data.id);
                setIsNew(false);
                Notify.success('Pharmacy created successfully', {position: "center-bottom"});
            });
        } else {
            axiosInstance.put('api/v1/pharmacies', {
                id: pharmacyId,
                name: nameRef.current.value.trim(),
                address: addressRef.current.value.trim(),
                phoneNumber: phoneNumberRef.current.value.trim(),
                latitude: latitudeRef.current.value.trim(),
                longitude: longitudeRef.current.value.trim(),
                zoneId: currentZone,
            }).then(() => {
                setIsNew(false);
                Notify.success('Pharmacy updated successfully', {position: "center-bottom"});
            });
        }
    }

    const MapClickHandler = () => {
        useMapEvent("click", (e) => {
            const latlng = e.latlng;
            setPharmacyPosition([latlng.lat, latlng.lng]);
            latitudeRef.current.value = latlng.lat;
            longitudeRef.current.value = latlng.lng;
        });
    };

    return (
        <>
            <Header/>
            <Container className="mt-5">
                <Form onSubmit={submit}>
                    <FloatingLabel className="mb-3" label="Name">
                        <Form.Control ref={nameRef} required type="text" placeholder="Name"/>
                    </FloatingLabel>
                    <FloatingLabel className="mb-3" label="Address">
                        <Form.Control ref={addressRef} required type="text" placeholder="Address"/>
                    </FloatingLabel>
                    <FloatingLabel className="mb-3" label="Phone number">
                        <Form.Control ref={phoneNumberRef} required type="text" placeholder="Phone number"/>
                    </FloatingLabel>
                    <div className="d-flex align-items-center gap-3">
                        <div className="flex-grow-1">
                            <FloatingLabel className="mb-3" label="Latitude">
                                <Form.Control ref={latitudeRef} required type="number" step="any"
                                              placeholder="Latitude"/>
                            </FloatingLabel>
                            <FloatingLabel className="mb-3" label="Longitude">
                                <Form.Control ref={longitudeRef} required type="number" step="any"
                                              placeholder="Longitude"/>
                            </FloatingLabel>
                        </div>
                        <Button variant="outline-secondary" onClick={() => setShowMap(true)}>
                            <i className="bi bi-geo-alt-fill"></i>
                        </Button>
                    </div>
                    <Form.Select className="mb-3" required value={currentCity}
                                 onChange={(e) => setCurrentCity(e.target.value)}>
                        <option hidden value={-1}>Select a city</option>
                        {
                            cities
                            &&
                            cities.map((city) => (
                                <option key={city.id} value={city.id}>{city.name}</option>
                            ))
                        }
                    </Form.Select>
                    {zones.length > 0 &&
                        <Form.Select required className="mb-3" value={currentZone}
                                     onChange={(e) => setCurrentZone(e.target.value)}>
                            <option hidden value={-1}>Select a zone</option>
                            {zones.map((zone) => (
                                <option key={zone.id} value={zone.id}>{zone.name}</option>
                            ))}
                        </Form.Select>
                    }
                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="success" size="sm" hidden={isNew} onClick={() => setShowDisponibility(true)}>
                            Disponibility
                        </Button>
                        <Button type="submit" variant="primary" size="sm">{isNew ? "Create" : "Update"}</Button>
                    </div>
                </Form>
                <Modal show={showMap} size="lg" onHide={() => setShowMap(false)}>
                    <Modal.Body>
                        <MapContainer center={[30.162849, -8.312519]} zoom={5} scrollWheelZoom={true}
                                      style={{height: "75vh"}}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {
                                pharmacyPosition
                                &&
                                <Marker position={pharmacyPosition}></Marker>
                            }
                            <MapClickHandler/>
                        </MapContainer>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={() => setShowMap(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                {
                    pharmacyId && showDisponibility
                    &&
                    <Disponibility pharmacyId={pharmacyId} show={showDisponibility}
                                   setShow={setShowDisponibility}/>
                }
            </Container>
            <Footer/>
        </>
    )
}

export default MyPharmacy;