import Header from "./Header.jsx";
import Container from "react-bootstrap/Container";
import {useEffect, useState} from "react";
import axiosInstance from "../axiosInstance.js";
import {Button, Card, Col, Form, Modal, Row} from "react-bootstrap";
import {MapContainer, Marker, TileLayer, Tooltip} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {Report} from 'notiflix/build/notiflix-report-aio';
import pharmacyImage from '../assets/pharmacy.png'
import Footer from "./Footer.jsx";

function Pharmacies() {
    const [cities, setCities] = useState([]);
    const [currentCity, setCurrentCity] = useState(null);
    const [zones, setZones] = useState([]);
    const [currentZone, setCurrentZone] = useState(null);
    const [pharmacies, setPharmacies] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [showAllInMap, setShowAllInMap] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [currentPharmacy, setCurrentPharmacy] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);

    useEffect(() => {
        axiosInstance.get('v1/cities').then((response) => {
            setCities(response.data);
        });
    }, []);

    useEffect(() => {
        if (currentCity !== null) {
            axiosInstance.get(`/v1/cities/${currentCity}/zones`).then((response) => {
                setZones(response.data);
            });
        }
    }, [currentCity]);

    useEffect(() => {
        if (currentZone !== null) {
            if (currentLocation === null) {
                axiosInstance.get(`/v1/zones/${currentZone}/pharmacies`).then((response) => {
                    setPharmacies(response.data);
                });
            } else {
                axiosInstance.post(`/v1/zones/${currentZone}/pharmacies/closest`, {
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                }).then((response) => {
                    setPharmacies(response.data);
                });
            }
        }
    }, [currentZone, currentLocation]);

    useEffect(() => {
        if (pharmacies.length > 0 && currentLocation === null && currentPharmacy === null) {
            setMapCenter([pharmacies[0].latitude, pharmacies[0].longitude]);
        } else if (currentPharmacy !== null && currentLocation === null) {
            setMapCenter([currentPharmacy.latitude, currentPharmacy.longitude]);
        } else if (currentLocation !== null) {
            setMapCenter([currentLocation.latitude, currentLocation.longitude]);
        }
    }, [pharmacies, currentLocation, currentPharmacy])

    function getCurrentPosition(event) {
        if (!navigator.geolocation) {
            Report.failure(
                'Failure',
                'This feature is not supported by your device.',
                'Okay',
                {backOverlay: false}
            );
        }
        if (!event.target.checked) {
            setCurrentLocation(null);
            return;
        }
        navigator.geolocation.getCurrentPosition((success) => {
            setCurrentLocation({latitude: success.coords.latitude, longitude: success.coords.longitude});
        }, (error) => {
            if (error.code === error.PERMISSION_DENIED) {
                event.target.checked = false;
                Report.failure(
                    'Failure',
                    'This feature needs to access you location.',
                    'Okay',
                    {backOverlay: false}
                );
            }
        });
    }

    function customMarker(pharmacy) {
        return (
            <Marker key={pharmacy.id} position={[pharmacy.latitude, pharmacy.longitude]}
                    eventHandlers={{
                        click: () => {
                            if (currentLocation !== null) {
                                window.open(`https://www.google.com/maps/dir/${currentLocation.latitude},${currentLocation.longitude}/${pharmacy.latitude},${pharmacy.longitude}`, "_blank");
                            } else {
                                window.open(`https://www.google.com/maps/search/?api=1&query=${pharmacy.latitude},${pharmacy.longitude}`, "_blank");
                            }
                        },
                    }}>
                <Tooltip direction="bottom" offset={[-15, 30]} permanent>
                    {pharmacy.name}
                </Tooltip>
            </Marker>
        );
    }

    return (
        <>
            <Header/>
            <Container className="mt-5">
                <Row xs={1} md={3} className="g-2 g-md-5">
                    <Col className="d-flex align-items-center">
                        <Form.Switch label="Closest" onChange={getCurrentPosition}/>
                    </Col>
                    <Col>
                        <Form.Select onChange={(e) => setCurrentCity(e.target.value)}>
                            <option hidden={true}>Select a city</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.id}>{city.name}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col>
                        {
                            zones.length > 0
                            &&
                            <Form.Select onChange={(e) => setCurrentZone(e.target.value)}>
                                <option hidden={true}>Select a zone</option>
                                {zones.map((zone) => (
                                    <option key={zone.id} value={zone.id}>{zone.name}</option>
                                ))}
                            </Form.Select>
                        }
                    </Col>
                </Row>
                <Row className="mt-3" hidden={pharmacies.length === 0}>
                    <Col className="d-flex justify-content-center">
                        <Button variant="primary" onClick={() => {
                            setShowMap(true);
                            setShowAllInMap(true);
                        }}>Show all in map</Button>
                    </Col>
                </Row>
                <Row className="mt-5 g-3">
                    {
                        pharmacies.length > 0
                        &&
                        pharmacies.map((pharmacy) => (
                            <Col key={pharmacy.id}>
                                <Card style={{width: '18rem'}} className="mx-auto">
                                    <Card.Img variant="top" className="p-3" src={pharmacyImage}/>
                                    <Card.Body>
                                        <Card.Title>{pharmacy.name}</Card.Title>
                                        <Card.Text>{pharmacy.address}</Card.Text>
                                        <Button variant="primary"
                                                onClick={() => {
                                                    setCurrentPharmacy(pharmacy);
                                                    setShowMap(true);
                                                }}
                                        >Show in map</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    }
                </Row>
                {
                    mapCenter
                    &&
                    <Modal show={showMap} centered size="lg" onHide={() => {
                        setShowMap(false);
                        setShowAllInMap(false);
                    }}>
                        <Modal.Body>
                            <MapContainer center={mapCenter} style={{height: "75vh"}} zoom={13}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {
                                    currentLocation
                                    &&
                                    <Marker position={[currentLocation.latitude, currentLocation.longitude]}>
                                        <Tooltip direction="top" offset={[-15, -15]} permanent>Your location</Tooltip>
                                    </Marker>
                                }
                                {
                                    (showAllInMap) ?
                                        pharmacies.map((pharmacy) => customMarker(pharmacy))
                                        :
                                        (currentPharmacy) ? customMarker(currentPharmacy) : null
                                }
                            </MapContainer>
                        </Modal.Body>
                    </Modal>
                }
            </Container>
            <Footer/>
        </>
    )
        ;
}

export default Pharmacies;