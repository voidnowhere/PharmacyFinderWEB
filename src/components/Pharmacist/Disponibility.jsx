import {Button, Form, Modal, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import axiosInstance from "../../axiosInstance.js";
import {Notify} from 'notiflix/build/notiflix-notify-aio';

function Disponibility({pharmacyId, show, setShow}) {
    const [showModal, setShowModal] = useState(show);
    const [weekdays, setWeekdays] = useState([]);

    useEffect(() => {
        axiosInstance.get(`api/v1/pharmacies/${pharmacyId}/weekdays`).then((response) => {
            setWeekdays(response.data);
        });
    }, []);

    function save(weekDayId) {
        const weekDay = weekdays.find((w) => w.id === weekDayId);
        axiosInstance.put(`api/v1/pharmacy_weekdays/${weekDayId}`, {
            id: weekDayId,
            firstShiftOpens: weekDay.firstShiftOpens,
            firstShiftCloses: weekDay.firstShiftCloses,
            secondShiftOpens: weekDay.secondShiftOpens,
            secondShiftCloses: weekDay.secondShiftCloses,
        }).then(() => {
            Notify.success('Weekday updated successfully', {position: "center-bottom"});
        });
    }

    return (
        <Modal show={showModal} onHide={() => setShow(false)} size="lg">
            <Modal.Body>
                <Table hover className="align-middle">
                    <thead>
                    <tr>
                        <th>Weekday</th>
                        <th>First shift opens</th>
                        <th>First shift closes</th>
                        <th>Second shift opens</th>
                        <th>Second shift closes</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {weekdays.map((weekday) => (
                        <tr key={weekday.id}>
                            <td>{weekday.weekDay.name}</td>
                            <td>
                                <Form.Control type="time" defaultValue={weekday.firstShiftOpens}
                                              onChange={(e) => {
                                                  setWeekdays(prevState => prevState.map((p) => {
                                                      if (p.id === weekday.id) {
                                                          p.firstShiftOpens = e.target.value;
                                                      }
                                                      return p;
                                                  }))
                                              }}/>
                            </td>
                            <td>
                                <Form.Control type="time" defaultValue={weekday.firstShiftCloses}
                                              onChange={(e) => {
                                                  setWeekdays(prevState => prevState.map((p) => {
                                                      if (p.id === weekday.id) {
                                                          p.firstShiftCloses = e.target.value;
                                                      }
                                                      return p;
                                                  }))
                                              }}/>
                            </td>
                            <td>
                                <Form.Control type="time" defaultValue={weekday.secondShiftOpens}
                                              onChange={(e) => {
                                                  setWeekdays(prevState => prevState.map((p) => {
                                                      if (p.id === weekday.id) {
                                                          p.secondShiftOpens = e.target.value;
                                                      }
                                                      return p;
                                                  }))
                                              }}/>
                            </td>
                            <td>
                                <Form.Control type="time" defaultValue={weekday.secondShiftCloses}
                                              onChange={(e) => {
                                                  setWeekdays(prevState => prevState.map((p) => {
                                                      if (p.id === weekday.id) {
                                                          p.secondShiftCloses = e.target.value;
                                                      }
                                                      return p;
                                                  }))
                                              }}/>
                            </td>
                            <td>
                                <Button variant="outline-primary" size="sm"
                                        onClick={() => save(weekday.id)}>Update</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" size="sm" onClick={() => setShow(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Disponibility;