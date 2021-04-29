import { useLocation } from "react-router-dom";
import { Redirect } from 'react-router-dom'
import React from 'react';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export const OAuth2RedirectHandler = () => {
    const params = useQuery();
    const token = params.get('token');
    //const error = params.get('error');

    if (token)
        localStorage.setItem('accessToken', token.toString());

    return (
        <Redirect to={{pathname: "/"}}/>
    )

}