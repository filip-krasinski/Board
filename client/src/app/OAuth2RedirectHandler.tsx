import { useLocation } from "react-router-dom";
import { Redirect } from 'react-router-dom'
import Api from './api/Api';
import React from 'react';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

interface IProps {
    update: any
}

export const OAuth2RedirectHandler: React.FC<IProps> = ({ update }) => {
    const params = useQuery();
    const token = params.get('token');
    //const error = params.get('error');

    if (token)
        localStorage.setItem('accessToken', token.toString());

    Api.User.current()
        .then(res => {
            update((prevState: any) => ({
                    ...prevState,
                    currentUser: res,
                    loading: false
                }))
            }
        )
;

    return (
        <Redirect to={{pathname: "/"}}/>
    )

}