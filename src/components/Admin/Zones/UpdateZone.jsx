import {Button, FloatingLabel, Form, Modal} from "react-bootstrap";
import {useEffect, useRef, useState} from "react";
import axiosInstance from "../../../axiosInstance.js";
import {Notify} from 'notiflix/build/notiflix-notify-aio';

function UpdateZone({zoneId, setCurrentZone, getZones}) {
    const [showModal, setShowModal] = useState(true);
    const nameRef = useRef();

    useEffect(() => {
        axiosInstance.get(`api/v1/zones/${zoneId}`).then((response) => {
            nameRef.current.value = response.data.name;
        });
    }, []);

    function update(event) {
        event.preventDefault();
        axiosInstance.put('api/v1/zones', {
            id: zoneId,
            name: nameRef.current.value.trim(),
        }).then(() => {
            setCurrentZone(null);
            getZones();
            Notify.success('Zone updated successfully', {position: "center-bottom"});
        });
    }

    return (
        <Modal show={showModal} onHide={() => setCurrentZone(null)} centered>
            <Modal.Body>
                <Form onSubmit={update}>
                    <FloatingLabel label="Name">
                        <Form.Control ref={nameRef} type="text" placeholder="Name"/>
                    </FloatingLabel>
                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button variant="secondary" size="sm" onClick={() => setCurrentZone(null)}>
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

export default UpdateZone;