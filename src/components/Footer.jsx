import Container from "react-bootstrap/Container";

export default function Footer() {
    return (
        <>
            <p className="py-4"></p>
            <footer className="fixed-bottom">
                <Container>
                    <hr/>
                    <div className="d-flex justify-content-between">
                        <p>&copy; {new Date().getFullYear()}</p>
                        <p className="d-flex gap-2">
                            <a href="https://www.facebook.com/">
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a href="https://twitter.com/">
                                <i className="bi bi-twitter"></i>
                            </a>
                            <a href="mailto:example@example.com">
                                <i className="bi bi-envelope-at-fill"></i>
                            </a>
                            <a href="tel:0512345678">
                                <i className="bi bi-telephone-fill"></i>
                            </a>
                            <a href="https://goo.gl/maps/fwNFqu6ULWwAjJPCA">
                                <i className="bi bi-geo-alt-fill"></i>
                            </a>
                        </p>
                    </div>
                </Container>
            </footer>
        </>
    )
}