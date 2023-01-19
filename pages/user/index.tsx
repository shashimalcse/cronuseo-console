import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Create_Model from "../../components/create_model";
import { useState, useEffect } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
    IRolesReslut,
    IUserCreateRequest,
    IUsersReslut,
} from "../../src/interfaces";
import { routes } from "../../src/routes";
import Link from "next/link";
import Select from "react-select";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";

export type RoleOption = {
    label: string;
    value: string;
    id: string;
};

const Users = ({ usersResult, rolesResult }: { usersResult: IUsersReslut[], rolesResult: IRolesReslut[] }) => {
    const [showModal, setShowModel] = useState(false);
    const [users, setUsers] = useState<IUsersReslut[]>(usersResult);
    const [roles, setRoles] = useState<IRolesReslut[]>(rolesResult);
    const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<RoleOption[]>([]);
    const [user, setUser] = useState<IUserCreateRequest>({
        username: "",
        firstname: "",
        lastname: "",
        roles: [],
    });

    const router = useRouter();
    const { status, data } = useSession();

    const submitUser = async () => {
        const role_ids = selectedOptions.map((role) => {
            return { role_id: role.id };
        });
        user.roles = role_ids;
        const response = await fetch(
            `${process.env.BASE_API}/${data?.user?.org_id}/user`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${data?.accessToken}`,
                    "Content-Type": "application/json ; charset=utf8",
                },
                body: JSON.stringify(user),
            }
        );
        if (response.status === 401) {
            router.push("/auth/signin");
        }
        if (response.status == 201) {
            setUser({ username: "", firstname: "", lastname: "" });
            setShowModel(false);
        }
        fetchUsers();
    };

    const deleteUser = async (user_id: string) => {
        const response = await fetch(
            `${process.env.BASE_API}/${data?.user?.org_id}/user` + `/${user_id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${data?.accessToken}`,
                    "Content-Type": "application/json ; charset=utf8",
                },
            }
        );
        if (response.status === 401) {
            router.push("/auth/signin");
        }
        fetchUsers();
    };

    const fetchUsers = async () => {
        await fetch(`${process.env.BASE_API}/${data?.user?.org_id}/user`, {
            headers: {
                Authorization: `Bearer ${data?.accessToken}`,
                "Content-Type": "application/json ; charset=utf8",
            },
        })
            .then((res) => {
                if (res.status === 401) {
                    router.push("/auth/signin");
                }
                return res.json();
            })
            .then((data) => {
                setUsers(data?.results);
            });
    };

    useEffect(() => {
        if (roles) {
            if (roles.length > 0) {
                const options = roles.map((role) => {
                    return { label: role.name, value: role.role_key, id: role.role_id };
                });
                setRoleOptions(options);
            }
        }
    }, [roles]);

    function handleSelect(data: any) {
        setSelectedOptions(data);
    }
    const customStyles = {
        option: (defaultStyles: any, state: any) => ({
            ...defaultStyles,
        }),

        control: (defaultStyles: any) => ({
            ...defaultStyles,
            backgroundColor: "#4B5563",
            border: "solid #71717A",
            fontSize: "12px",
        }),
        singleValue: (defaultStyles: any) => ({ ...defaultStyles, color: "#fff" }),
    };
    return (
        <div className="flex flex-col h-full">
            <div className="flex-none w-[100hv] h-[50px] mx-8 my-4">
                <div className="flex flex-row justify-between items-start">
                    <div className="flex flex-col">
                        <h1 className="font-sans text-xl font-bold">Users</h1>
                        <div className="text-gray-500 text-sm">
                            Users who can request permissions for resources.
                        </div>
                    </div>
                    <button
                        className="bg-black rounded px-4 py-2 text-white font-semibold"
                        onClick={() => setShowModel(true)}
                    >
                        <div className="flex flex-row justify-between items-center gap-2">
                            <FontAwesomeIcon icon={faPlus} />
                            Create a Users
                        </div>
                    </button>
                </div>
            </div>
            <div className="flex-grow">
                {users && users.length > 0 ? (
                    <div className="flex flex-col">
                        <div className="overflow-x-auto">
                            <div className="p-5 w-full inline-block align-middle">
                                <div className="overflow-hidden border rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-10 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                                    <a className="">Username</a>
                                                </th>
                                                <th className="px-10 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                                    <a className="">First Name</a>
                                                </th>
                                                <th className="px-10 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                                    <a className="">Last Name</a>
                                                </th>
                                                <th className="px-10 py-3 text-xs font-bold text-right text-gray-500 uppercase ">
                                                    <a className="">Actions</a>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users?.map((user: IUsersReslut) => {
                                                return (
                                                    <tr key={user.username}>
                                                        <td className="px-10 py-2 text-left text-gray-800 whitespace-nowrap">
                                                            <Link href={"/user/" + user.user_id}>
                                                                {user.username}
                                                            </Link>
                                                        </td>

                                                        <td className="px-10 py-2 text-left text-gray-800 whitespace-nowrap">
                                                            {user.firstname}
                                                        </td>
                                                        <td className="px-10 py-2 text-left text-gray-800 whitespace-nowrap">
                                                            {user.lastname}
                                                        </td>
                                                        <td className="px-10 py-2 text-right text-gray-800 whitespace-nowrap">
                                                            <button
                                                                onClick={() => {
                                                                    deleteUser(user.user_id);
                                                                }}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-full justify-center items-center gap-5">
                        <div className="text-gray-400 text-sm">
                            There are no users available at the moment.
                        </div>
                        <button
                            className="bg-black rounded-md px-4 py-2 text-white font-semibold"
                            onClick={() => setShowModel(true)}
                        >
                            <div className="flex flex-row justify-between items-center gap-2">
                                <FontAwesomeIcon icon={faPlus} />
                                Create a User
                            </div>
                        </button>
                    </div>
                )}
            </div>
            <Create_Model
                title="Create a New User"
                isVisible={showModal}
                onClose={() => {
                    setUser({ username: "", firstname: "", lastname: "" });
                    setShowModel(false);
                }}
            >
                <div tabIndex={0}>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Username
                    </label>
                    <input
                        type="text"
                        value={user.username}
                        onChange={(e) =>
                            setUser({
                                username: e.target.value,
                                firstname: user.firstname,
                                lastname: user.lastname,
                            })
                        }
                        id="username"
                        className="block w-full p-2 text-gray-50 border border-gray-500 rounded bg-gray-600 sm:text-xs hover:border-yellow-500 focus:outline-none focus:border-yellow-500 focus:ring-yellow-500"
                        placeholder="Resource Name"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        First Name
                    </label>
                    <input
                        type="text"
                        value={user.firstname}
                        onChange={(e) =>
                            setUser({
                                firstname: e.target.value,
                                username: user.username,
                                lastname: user.lastname,
                            })
                        }
                        id="firstname"
                        className="block w-full p-2 text-gray-50 border border-gray-500 rounded bg-gray-600 sm:text-xs hover:border-yellow-500 focus:outline-none focus:border-yellow-500 focus:ring-yellow-500"
                        placeholder="Resource Name"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Last Name
                    </label>
                    <input
                        type="text"
                        value={user.lastname}
                        onChange={(e) =>
                            setUser({
                                lastname: e.target.value,
                                username: user.username,
                                firstname: user.firstname,
                            })
                        }
                        id="lastname"
                        className="block w-full p-2 text-gray-50 border border-gray-500 rounded bg-gray-600 sm:text-xs hover:border-yellow-500 focus:outline-none focus:border-yellow-500 focus:ring-yellow-500"
                        placeholder="Resource Name"
                    />
                </div>
                {roles && roles.length > 0 ? (
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Roles for User
                        </label>
                        <Select
                            options={roleOptions}
                            isMulti
                            value={selectedOptions}
                            onChange={handleSelect}
                            styles={customStyles}
                        />
                    </div>
                ) :
                    <div className="text-gray-400 text-xs">There are no roles available at the moment. To assign roles to users, please create some roles first.</div>}

                <div className="flex flex-grow flex-row justify-end items-center">
                    <button
                        className="bg-yellow-500 rounded-md px-6 py-2 text-white text-xs"
                        onClick={() => {
                            submitUser();
                        }}
                    >
                        Create
                    </button>
                </div>
            </Create_Model>
        </div>
    );
};

export async function getServerSideProps({ req, res }: any) {
    const session = await getToken({ req: res.req });

    // Fetch all users.
    const response = await fetch(
        `${process.env.BASE_API}/${session?.org_id}/user`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
                "Content-Type": "application/json ; charset=utf8",
            },
        }
    );

    if (response.status === 401) {
        return {
            redirect: {
                permanent: false,
                destination: "/auth/signin",
            },
        };
    }
    const usersResult = await response.json();

    // Fetch all roles.
    const response2 = await fetch(
        `${process.env.BASE_API}/${session?.org_id}/role`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
                "Content-Type": "application/json ; charset=utf8",
            },
        }
    );

    if (response2.status === 401) {
        return {
            redirect: {
                permanent: false,
                destination: "/auth/signin",
            },
        };
    }

    const rolesResult = await response2.json();
    return {
        props: {
            usersResult: usersResult.results,
            rolesResult: rolesResult.results,
        },
    };
}

export default Users;
