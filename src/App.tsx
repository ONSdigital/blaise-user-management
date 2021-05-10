import React, {ReactElement, useEffect, useState} from "react";
// import Header from "./Components/ONSDesignSystem/Header";
import {DefaultErrorBoundary} from "./Components/ErrorHandling/DefaultErrorBoundary";
// import Footer from "./Components/ONSDesignSystem/Footer";
import {isDevEnv} from "./Functions";
import {
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import UserList from "./Components/UserList";
import {User} from "../Interfaces";
import {ErrorBoundary} from "./Components/ErrorHandling/ErrorBoundary";
import NewUser from "./pages/NewUser";
import ChangePassword from "./pages/ChangePassword";
import DeleteUser from "./pages/DeleteUser";
import SignIn from "./pages/SignIn";
import NewRole from "./pages/NewRole";
import {getAllUsers} from "./utilities/http";

import {NotProductionWarning, Footer, Header, ONSPanel, BetaBanner} from "blaise-design-system-react-components";
import Roles from "./pages/Roles";
import BulkUserUpload from "./pages/BulkUserUpload/BulkUserUpload";

interface Panel {
    visible: boolean
    message: string
    status: string
}

interface window extends Window {
    VM_EXTERNAL_CLIENT_URL: string
    CATI_DASHBOARD_URL: string
}

const divStyle = {
    minHeight: "calc(67vh)"
};

function App(): ReactElement {

    const [externalCATIUrl, setExternalCATIUrl] = useState<string>("/Blaise");
    const [panel, setPanel] = useState<Panel>({visible: false, message: "", status: "info"});

    const updatePanel = (visible = false, message = "", status = "info") => {
        setPanel(
            {visible: visible, message: message, status: status}
        );
    };


    useEffect(function retrieveVariables() {
        setExternalCATIUrl(isDevEnv() ?
            process.env.REACT_APP_CATI_DASHBOARD_URL || externalCATIUrl : (window as unknown as window).CATI_DASHBOARD_URL);
    }, [externalCATIUrl]);

    const [users, setUsers] = useState<User[]>([]);
    const [listError, setListError] = useState<string>("Loading ...");

    const [authentication, setAuthentication] = useState(null);


    // A wrapper for <Route> that redirects to the login
    // screen if you're not yet authenticated.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line react/prop-types
    function PrivateRoute({children, ...rest}) {
        return (
            <Route
                exact
                {...rest}
                render={({location}) =>
                    authentication !== null ? (
                        children
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/signin",
                                state: {from: location}
                            }}
                        />
                    )
                }
            />
        );
    }

    useEffect(() => {
        getUserList().then(() => console.log("Call getUserList Complete"));
    }, []);

    async function getUserList() {
        setUsers([]);

        const [success, instrumentList] = await getAllUsers();

        if (!success) {
            setListError("Unable to load users");
            return;
        }

        if (instrumentList.length === 0) {
            setListError("No installed users found.");
        }

        setUsers(instrumentList);
    }


    return (
        <>
            <BetaBanner/>
            {
                (window.location.hostname.includes("dev")) && <NotProductionWarning/>
            }
            <Header title={"Blaise User Management"}/>
            <div style={divStyle} className="page__container container">
                <main id="main-content" className="page__main">
                    <ONSPanel hidden={!panel.visible} status={panel.status}>
                        <p>{panel.message}</p>
                    </ONSPanel>
                    <DefaultErrorBoundary>
                        <Switch>
                            <PrivateRoute path={"/user/upload"}>
                                <BulkUserUpload/>
                            </PrivateRoute>
                            <PrivateRoute path={"/user/changepassword/:user"}>
                                <ChangePassword/>
                            </PrivateRoute>
                            <PrivateRoute path={"/user/delete/:user"}>
                                <DeleteUser/>
                            </PrivateRoute>
                            <PrivateRoute path={"/user"}>
                                <NewUser/>
                            </PrivateRoute>
                            <PrivateRoute path={"/roles/new"}>
                                <NewRole/>
                            </PrivateRoute>
                            <PrivateRoute path={"/roles"}>
                                <Roles/>
                            </PrivateRoute>
                            <Route path="/signin">
                                <ErrorBoundary errorMessageText={"Unable to load survey table correctly"}>
                                    <SignIn setAuthenticationToken={setAuthentication}/>
                                </ErrorBoundary>
                            </Route>
                            <PrivateRoute path="/">
                                <ErrorBoundary errorMessageText={"Unable to load user table correctly"}>
                                    <UserList list={users}
                                              listError={listError}
                                              getUsers={getUserList}
                                              externalCATIUrl={externalCATIUrl}
                                              updatePanel={updatePanel}
                                              panel={panel}/>
                                </ErrorBoundary>
                            </PrivateRoute>
                        </Switch>
                    </DefaultErrorBoundary>
                </main>
            </div>
            <Footer/>
        </>
    );
}

export default App;
