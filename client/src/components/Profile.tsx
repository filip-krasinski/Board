import { RouteComponentProps } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Agent from '../api/Agent';
import { toast } from 'react-toastify';
import { IAuthUser } from '../model/IAuthUser';

interface MatchParams {
    id: string;
}


export const Profile = ({ match }: RouteComponentProps<MatchParams>) => {
    const [profile, setProfile] = useState<IAuthUser | null>();

    useEffect(() => {
        Agent.User.get(match.params.id)
            .then(setProfile)
            .catch(err => {
                toast.error("Failed to fetch data!");
                console.log(err)
            })
    }, [])

    return (
        <>

            {profile?.email}

        </>
    )
}