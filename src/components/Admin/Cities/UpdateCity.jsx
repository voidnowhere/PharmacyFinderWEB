import {Button, FloatingLabel, Form, Modal} from "react-bootstrap";
import {useEffect, useRef, useState} from "react";
import axiosInstance from "../../../axiosInstance.js";
import {Notify} from 'notiflix/build/notiflix-notify-aio';

function UpdateCity({cityId, setCurrentCity, getCities}) {
    const [showModal, setShowModal] = useState(true);
    const nameRef = useRef();

    useEffect(() => {
        axiosInstance.get(`api/v1/cities/${cityId}`).then((response) => {
            nameRef.current.value = response.data.name;
        });
    }, []);

    function update(event) {
        event.preventDefault();
        axiosInstance.put('api/v1/cities', {
            id: cityId,
            name: nameRef.current.value.trim(),
        }).then(() => {
            setCurrentCity(null);
            getCities();
            Notify.success('City updated successfully', {position: "center-bottom"});
        });
    }

    return (
        <Modal show={showModal} onHide={() => setCurrentCity(null)} centered>
            <Modal.Body>
                <Form onSubmit={update}>
                    <FloatingLabel label="Name">
                        <Form.Control ref={nameRef} type="text" placeholder="Name"/>
                    </FloatingLabel>
                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button variant="secondary" size="sm" onClick={() => setCurrentCity(null)}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="sm" type="submit">
                            Update
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default UpdateCity;