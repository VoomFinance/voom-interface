import React from 'react'
import { Navbar, Nav } from 'react-bootstrap';
import imgLogo from '../assets/images/logo_header.png'
import Connected from './utils/Connected';
import { withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Header = (props) => {
    const { t } = useTranslation();

    return (
        <>
            <Navbar className="nav_header" collapseOnSelect expand="lg" bg="" variant="dark">
                <Navbar.Brand href="#/">
                    <img
                        alt=""
                        src={imgLogo}
                        width="34"
                        height="34"
                        className="d-inline-block align-to logo_header"
                    />{' Voom Finance'}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto nav_menu">
                        <Nav.Link href="#/">{t("Home")}</Nav.Link>
                        <Nav.Link href="#/vault">{t("Vault")}</Nav.Link>
                        <Nav.Link href="#/network">{t("Network")}</Nav.Link>
                        <Nav.Link href="#/details">{t("Details")}</Nav.Link>
                    </Nav>
                    <Nav className="container_btn_connected" >
                        <Connected />
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}

export default withRouter(Header)
