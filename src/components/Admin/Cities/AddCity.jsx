import {Button, FloatingLabel, Form, Modal} from "react-bootstrap";
import {useRef, useState} from "react";
import axiosInstance from "../../../axiosInstance.js";
import {Notify} from 'notiflix/build/notiflix-notify-aio';

function AddCity({show, setShow, getCities}) {
    const [showModal, setShowModal] = useState(show);
    const nameRef = useRef();

    function add(event) {
        event.preventDefault();
        axiosInstance.post('api/v1/cities', {
            name: nameRef.current.value.trim(),
        }).then(() => {
            setShow(false);
            getCities();
            Notify.success('City added successfully', {position: "center-bottom"});
        });
    }

    return (
        <Modal show={showModal} onHide={() => setShow(false)} centered>
            <Modal.Body>
                <Form onSubmit={add}>
                    <FloatingLabel label="Name">
                        <Form.Control ref={nameRef} type="text" placeholder="Name"/>
                    </FloatingLabel>
                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button variant="secondary" size="sm" onClick={() => setShow(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="sm" type="submit">
                            Add
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default AddCity;