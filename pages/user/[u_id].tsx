import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { RoleOption } from ".";
import Create_Model from "../../components/create_model";
import {
    IRolesReslut,
    IUserCreateRequest,
    IUsersReslut,
    IUserUpdateRequest,
} from "../../src/interfaces";
import { routes } from "../../src/routes";
import Select from "react-select";
import { useSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";

const User = ({
    userResult,
    rolesResult,
    assignedRolesResult,
}: {
    userResult: IUsersReslut;
    rolesResult: IRolesReslut[];
    assignedRolesResult: IRolesReslut[];
}) => {
    const router = useRouter();
    const [user, setUser] = useState<IUsersReslut>(userResult);
    const [showRoles, setShowRoles] = useState(false);
    const [updateUser, setUpdateUser] = useState<IUserUpdateRequest>({
        firstname: user.firstname,
        lastname: user.lastname,
        roles: assignedRolesResult,
    });
    const [roles, setRoles] = useState<IRolesReslut[]>(rolesResult);
    const [assignedRoles, setAssignedRoles] =
        useState<IRolesReslut[]>(assignedRolesResult);
    const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<RoleOption[]>([]);
    const [patchAddRoles, setPatchAddRoles] = useState<RoleOption[]>([]);
    const [patchRemoveRoles, setPatchRemoveRoles] = useState<RoleOption[]>([]);
    const [assignedRoleOptions, setAssignedRoleOptions] = useState<RoleOption[]>(
        []
    );

    const { status, data } = useSession();

    const submitUpdateUser = async () => {
        const addroles = getDifference(patchAddRoles, assignedRoleOptions);
        const patchRequest = {
            operations: [
                {
                    op: "add",
                    path: "roles",
                    values: addroles.map((role) => ({ value: role.id })),
                },
                {
                    op: "remove",
                    path: "roles",
                    values: patchRemoveRoles.map((role) => ({ value: role.id })),
                },
            ],
        };
        const res = await fetch(
            `http://localhost:8080/api/v1/${user.org_id}/user` + `/${user.user_id}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${data?.accessToken}`,
                    "Content-Type": "application/json ; charset=utf8",
                },
                body: JSON.stringify(updateUser),
            }
        );

        if (res.status === 401) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/auth/signin",
                },
            };
        }
        if (addroles.length > 0 || patchRemoveRoles.length > 0) {
            const res2 = await fetch(
                `http://localhost:8080/api/v1/${user.org_id}/user` + `/${user.user_id}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${data?.accessToken}`,
                        "Content-Type": "application/json ; charset=utf8",
                    },
                    body: JSON.stringify(patchRequest),
                }
            );

            if (res2.status === 401) {
                return {
                    redirect: {
                        permanent: false,
                        destination: "/auth/signin",
                    },
                };
            }
        }

        fetchUser();
    };

    async function fetchUser() {
        const response = await fetch(
            `http://localhost:8080/api/v1/${user.org_id}/user` + `/${user.user_id}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${data?.accessToken}`,
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
    
        const userResult = await response.json();
        setUser(userResult)
    }

    useEffect(() => {
        if (roles && roles.length > 0) {
            const options = roles.map((role) => {
                return { label: role.name, value: role.role_key, id: role.role_id };
            });
            setRoleOptions(options);
            if (assignedRoles && assignedRoles.length > 0) {
                const assignedOptions = assignedRoles.map((role) => {
                    return { label: role.name, value: role.role_key, id: role.role_id };
                });
                setAssignedRoleOptions(assignedOptions);
                setSelectedOptions(assignedOptions);
            }
        }
    }, [roles, assignedRoles]);

    function handleSelect(data: any) {
        if (selectedOptions.length == 0) {
            setPatchRemoveRoles([]);
            setPatchAddRoles(data);
        } else {
            if (data.length == 0) {
                let removedOption = getDifference(selectedOptions, [])[0];
                var array = [...patchAddRoles];
                var index = array.indexOf(removedOption);
                if (index !== -1) {
                    array.splice(index, 1);
                    setPatchAddRoles(array);
                } else {
                    setPatchRemoveRoles((prev) => {
                        prev.push(removedOption);
                        return [...prev];
                    });
                }
            } else {
                if (selectedOptions.length < data.length) {
                    let addedOption = getDifference(data, selectedOptions)[0];
                    var array = [...patchRemoveRoles];
                    var index = array.indexOf(addedOption);
                    if (index !== -1) {
                        array.splice(index, 1);
                        setPatchRemoveRoles(array);
                    }
                    var array = [...patchAddRoles];
                    var index = array.indexOf(addedOption);
                    if (index !== -1) {
                    } else {
                        setPatchAddRoles((prev) => {
                            prev.push(addedOption);
                            return [...prev];
                        });
                    }
                } else {
                    let removedOption = getDifference(selectedOptions, data)[0];
                    var array = [...patchAddRoles];
                    var index = array.indexOf(removedOption);
                    if (index !== -1) {
                        array.splice(index, 1);
                        setPatchAddRoles(array);
                    } else {
                        setPatchRemoveRoles((prev) => {
                            prev.push(removedOption);
                            return [...prev];
                        });
                    }
                }
            }
        }

        setSelectedOptions(data);
    }

    function getDifference(a: RoleOption[], b: RoleOption[]): RoleOption[] {
        return a.filter((element1) => {
            return !b.some((element2) => {
                return element1.value === element2.value;
            });
        });
    }
    const customStyles = {
        option: (defaultStyles: any, state: any) => ({
            ...defaultStyles,
            fontSize: "12px",
        }),

        control: (defaultStyles: any) => ({
            ...defaultStyles,
            backgroundColor: "white",
            border: "solid #E4E4E7",
            fontSize: "12px",
            width: 500,
        }),
        singleValue: (defaultStyles: any) => ({ ...defaultStyles, color: "#fff" }),
    };

    return (
        <div className="">
            <div className="flex flex-col">
                <div className="flex flex-grow justify-between items-start w-[100hv] h-[50px] mx-8 my-4">
                    <div className="flex flex-row justify-between items-center gap-5">
                        <Link href={"/user"}>
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </Link>
                        <h1 className="font-sans text-xl font-bold">{`${user?.firstname} ${user?.lastname}`}</h1>
                        <div className="text-gray-500 text-sm">{user?.username}</div>
                    </div>
                </div>
                <div className="flex flex-col mx-10 border rounded-lg bg-white">
                    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-200">
                        <ul className="flex flex-wrap -mb-px">
                            <li
                                className="mr-2"
                                onClick={() => {
                                    setShowRoles(false);
                                }}
                            >
                                <a
                                    href="#"
                                    className={
                                        (!showRoles
                                            ? "text-yellow-400 border-yellow-400"
                                            : "hover:text-gray-600 hover:border-gray-300") +
                                        " inline-block p-4 rounded-t-lg border-b-2 border-transparent"
                                    }
                                >
                                    Settings
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex flex-col justify-between m-5 gap-2 w-[500px]">
                            <div>
                                <label className="block mb-2 text-xs font-medium">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={updateUser.firstname}
                                    onChange={(e) =>
                                        setUpdateUser({
                                            firstname: e.target.value,
                                            lastname: updateUser.lastname,
                                        })
                                    }
                                    id="firstname"
                                    className="block w-[500px] p-2 border rounded sm:text-xs hover:border-yellow-500 focus:outline-none focus:border-yellow-500 focus:ring-yellow-500"
                                    placeholder="First Name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-xs font-medium">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={updateUser.lastname}
                                    onChange={(e) =>
                                        setUpdateUser({
                                            lastname: e.target.value,
                                            firstname: updateUser.firstname,
                                        })
                                    }
                                    id="lastname"
                                    className="block w-[500px] p-2 border rounded sm:text-xs hover:border-yellow-500 focus:outline-none focus:border-yellow-500 focus:ring-yellow-500"
                                    placeholder="Last Name"
                                    required
                                />
                            </div>
                            {roles && roles.length > 0 ? (
                                <div>
                                    <label className="block mb-2 text-xs font-medium text-gray-900">
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
                            ) : <div className="text-gray-400 text-xs">There are no roles available at the moment. To assign roles to users, please create some roles first.</div>}
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-black rounded-md px-6 py-2 mb-5 mr-5 text-white text-xs"
                                onClick={() => submitUpdateUser()}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export async function getServerSideProps({ params, res }: any) {
    const session = await getToken({ req: res.req });

    const response = await fetch(
        `http://localhost:8080/api/v1/${session?.org_id}/user` + `/${params.u_id}`,
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

    const userResult = await response.json();

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

    // Fetch assigned roles.
    const response3 = await fetch(
        `http://localhost:8080/api/v1/${session?.org_id}/role/user/${params.u_id}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
                "Content-Type": "application/json ; charset=utf8",
            },
        }
    );

    if (response3.status === 401) {
        return {
            redirect: {
                permanent: false,
                destination: "/auth/signin",
            },
        };
    }

    const assignedRolesResult = await response3.json();
    return {
        props: {
            rolesResult: rolesResult.results,
            assignedRolesResult: assignedRolesResult.results,
            userResult: userResult,
        },
    };
}

export default User;
