import Header from "./Header.jsx";
import Container from "react-bootstrap/Container";
import {useEffect, useState} from "react";
import axiosInstance from "../axiosInstance.js";
import {Button, Card, Col, Form, Modal, Row} from "react-bootstrap";
import {MapContainer, Marker, TileLayer, Tooltip} from "react-leaflet";
import pharmacyImage from '../assets/pharmacy.png'
import Footer from "./Footer.jsx";

function Home() {
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
        axiosInstance.get('api/v1/cities').then((response) => {
            setCities(response.data);
        });
    }, []);

    useEffect(() => {
        if (currentCity !== null) {
            axiosInstance.get(`api/v1/cities/${currentCity}/zones`).then((response) => {
                setZones(response.data);
            });
        }
    }, [currentCity]);

    useEffect(() => {
        if (currentZone !== null) {
            navigator.geolocation.getCurrentPosition((success) => {
                const coords = success.coords;
                setCurrentLocation({latitude: coords.latitude, longitude: coords.longitude});
                axiosInstance.post(`api/v1/zones/${currentZone}/pharmacies/closest`, {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                }).then((response) => {
                    setPharmacies(response.data);
                });
            }, (error) => {
                axiosInstance.get(`api/v1/zones/${currentZone}/pharmacies`).then((response) => {
                    setPharmacies(response.data);
                });
            });
        }
    }, [currentZone]);

    useEffect(() => {
        if (pharmacies.length > 0 && currentLocation === null && currentPharmacy === null) {
            setMapCenter([pharmacies[0].latitude, pharmacies[0].longitude]);
        } else if (currentPharmacy !== null && currentLocation === null) {
            setMapCenter([currentPharmacy.latitude, currentPharmacy.longitude]);
        } else if (currentLocation !== null) {
            setMapCenter([currentLocation.latitude, currentLocation.longitude]);
        }
    }, [pharmacies, currentLocation, currentPharmacy]);

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
                <Row xs={1} md={2} className="g-2 g-md-5">
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
                        <Button variant="outline-primary shadow" onClick={() => {
                            setShowMap(true);
                            setShowAllInMap(true);
                        }}>
                            <i className="bi bi-globe-americas"> Map</i>
                        </Button>
                    </Col>
                </Row>
                <div className="d-flex flex-wrap gap-3 mt-4">
                    {
                        pharmacies.length > 0
                        &&
                        pharmacies.map((pharmacy) => (
                            <Card key={pharmacy.id} style={{width: '18rem'}} className="mx-auto shadow rounded">
                                <Card.Body className="d-flex gap-3 align-items-center">
                                    <img src={pharmacyImage} width={40} align="Pharmacy"/>
                                    <div className="flex-grow-1">
                                        <Card.Title>{pharmacy.name}</Card.Title>
                                        <div>
                                            <a href={`tel:${pharmacy.phoneNumber}`}>{pharmacy.phoneNumber}</a>
                                            <div>{pharmacy.address}</div>
                                        </div>
                                    </div>
                                    <Button variant="outline-primary"
                                            onClick={() => {
                                                setCurrentPharmacy(pharmacy);
                                                setShowMap(true);
                                            }}
                                    >
                                        <i className="bi bi-geo-alt-fill"></i>
                                    </Button>
                                </Card.Body>
                            </Card>
                        ))
                    }
                </div>
                {
                    mapCenter
                    &&
                    <Modal show={showMap} centered size="lg" onHide={() => {
                        setShowMap(false);
                        setShowAllInMap(false);
                    }}>
                        <Modal.Body>
                            <MapContainer center={mapCenter} style={{height: "75vh"}} zoom={8}>
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
    );
}

export default Home;