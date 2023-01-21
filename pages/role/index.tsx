import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Create_Model from '../../components/create_model'
import { useState, useEffect } from 'react'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { IRoleCreateRequest, IRolesReslut } from '../../src/interfaces'
import { routes } from '../../src/routes';
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { getToken } from 'next-auth/jwt'

const Roles = ({ rolesResult }: { rolesResult: IRolesReslut[] }) => {
    const [showModal, setShowModel] = useState(false)
    const [roles, setRoles] = useState<IRolesReslut[]>(rolesResult)
    const [role, setRole] = useState<IRoleCreateRequest>({ name: "", role_key: "" })

    const router = useRouter();
    const { status, data } = useSession();

    const submitRole = async () => {
        const response = await fetch(`${process.env.BASE_API}/${data?.user?.org_id}/role`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${data?.accessToken}`,
                "Content-Type": "application/json ; charset=utf8",
            },
            body: JSON.stringify(role)
        })
        if (response.status === 401) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/auth/signin",
                },
            };
        }
        if (response.status == 201) {
            setRole({ name: "", role_key: "" })
            setShowModel(false)
        }
        fetchRoles()

    }

    const deleteRole = async (role_id: string) => {
        const response = await fetch(`${process.env.BASE_API}/${data?.user?.org_id}/role` + `/${role_id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${data?.accessToken}`,
                "Content-Type": "application/json ; charset=utf8",
            },
        })
        if (response.status === 401) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/auth/signin",
                },
            };
        }
        fetchRoles()
    }

    const fetchRoles = async () => {
        fetch(`${process.env.BASE_API}/${data?.user?.org_id}/role`, {
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
                setRoles(data?.results)
            })
    }


    return (
        <div className="flex flex-col h-full">
            <div className="flex-none w-[100hv] h-[50px] mx-8 my-4">
                <div className="flex flex-row justify-between items-start">
                    <div className="flex flex-col">
                        <h1 className="font-sans text-xl font-bold">Roles</h1>
                        <div className="text-gray-500 text-sm">
                            Roles are the set of permissions that grant access to actions and resources.
                        </div>
                    </div>
                    <button
                        className="bg-black rounded px-4 py-2 text-white font-semibold"
                        onClick={() => setShowModel(true)}
                    >
                        <div className="flex flex-row justify-between items-center gap-2">
                            <FontAwesomeIcon icon={faPlus} />
                            Create a Role
                        </div>
                    </button>
                </div>
            </div>
            <div className="flex-grow">
                {roles && roles.length > 0 ? (
                    <div className="flex flex-col">
                        <div className="overflow-x-auto">
                            <div className="p-5 w-full inline-block align-middle">
                                <div className="overflow-hidden border rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-10 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                                    <a className="">Resource Name</a>
                                                </th>
                                                <th className="px-10 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                                    <a className="">Resource Key</a>
                                                </th>
                                                <th className="px-10 py-3 text-xs font-bold text-right text-gray-500 uppercase ">
                                                    <a className="">Actions</a>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {roles?.map((role: IRolesReslut) => {
                                                return (
                                                    <tr key={role.role_key}>
                                                        <td className="px-10 py-2 text-left text-gray-800 whitespace-nowrap">
                                                            <Link href={"/role/" + role.role_id}>
                                                                {role.name}
                                                            </Link>
                                                        </td>

                                                        <td className="px-10 py-2 text-left text-gray-800 whitespace-nowrap">
                                                            {role.role_key}
                                                        </td>
                                                        <td className="px-10 py-2 text-right text-gray-800 whitespace-nowrap">
                                                            <button
                                                                onClick={() => {
                                                                    deleteRole(role.role_id);
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
                            There are no roles available at the moment.
                        </div>
                        <button
                            className="bg-black rounded px-4 py-2 text-white font-semibold"
                            onClick={() => setShowModel(true)}
                        >
                            <div className="flex flex-row justify-between items-center gap-2">
                                <FontAwesomeIcon icon={faPlus} />
                                Create a Role
                            </div>
                        </button>
                    </div>
                )}
            </div>
            <Create_Model
                title="Create a Role"
                isVisible={showModal}
                onClose={() => {
                    setRole({ name: "", role_key: "" });
                    setShowModel(false);
                }}
            >
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Role Name
                    </label>
                    <input
                        type="text"
                        value={role.name}
                        onChange={(e) =>
                            setRole({
                                name: e.target.value,
                                role_key: role.role_key,
                            })
                        }
                        id="name"
                        className="block w-full p-2 text-gray-50 border border-gray-500 rounded bg-gray-600 sm:text-xs focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="Role Name"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Role Key
                    </label>
                    <input
                        type="text"
                        value={role.role_key}
                        onChange={(e) =>
                            setRole({ name: role.name, role_key: e.target.value })
                        }
                        id="key"
                        className="block w-full p-2 text-gray-50 border border-gray-500 rounded bg-gray-600 sm:text-xs focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="Role Name"
                    />
                </div>
                <div className="flex flex-grow flex-row justify-end items-center">
                    <button
                        className="bg-yellow-500 rounded px-6 py-2 text-white text-xs"
                        onClick={() => {
                            submitRole();
                        }}
                    >
                        Create
                    </button>
                </div>
            </Create_Model>
        </div>

    )
}

export async function getServerSideProps({ req, res }: any) {
    const session = await getToken({ req: res.req });

    const response = await fetch(
        `${process.env.BASE_API}/${session?.org_id}/role`,
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

    const rolesResult = await response.json();
    return {
        props: {
            rolesResult: rolesResult.results,
        },
    };
}

export default Roles;
