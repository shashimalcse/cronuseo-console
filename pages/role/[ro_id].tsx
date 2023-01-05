import { faPlus, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Create_Model from "../../components/create_model";
import { routes } from "../../src/routes";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { IResourcesReslut, IRolesReslut } from "../../src/interfaces";
import Select from 'react-select';

export default function Role() {
  const router = useRouter();
  const [role, setRole] = useState<IRolesReslut | undefined>(undefined);
  const [showCreateAction, setShowCreateAction] = useState(false);
  const [resources, setResources] = useState<IResourcesReslut[] | undefined>(undefined)
  const [name, setName] = useState("");
  const [showModal, setShowModel] = useState(false);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const { ro_id } = router.query;
    console.log(routes.role + `/${ro_id}`)
    fetch(routes.role + `/${ro_id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setRole(data);
        setName(data.name);
      });
  }, [router.isReady]);

  useEffect(() => {
    fetch(routes.resource)
    .then((res) => res.json())
    .then((data) => {
        setResources(data?.results)
    })
    
})

  return (
    <div className="">
      <div className="flex flex-col">
        <div className="flex flex-grow justify-between items-start w-[100hv] h-[50px] mx-8 my-4">
          <div className="flex flex-row justify-between items-center gap-5">
            <Link href={"/role"}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </Link>
            <h1 className="font-sans text-xl font-bold">{role?.name}</h1>
            <div className="text-gray-500 text-sm">
              {role?.role_key}
            </div>
          </div>
          {showCreateAction ? (
            <button
              className="bg-black rounded-md px-4 py-2 text-white font-semibold"
              onClick={() => setShowModel(true)}
            >
              <div className="flex flex-row justify-between items-center gap-2">
                <FontAwesomeIcon icon={faPlus} />
                Add a Permission
              </div>
            </button>
          ) : null}
        </div>
        <div className="flex flex-col mx-10 border rounded-lg bg-white">
          <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-200">
            <ul className="flex flex-wrap -mb-px">
              <li
                className="mr-2"
                onClick={() => {
                  setShowCreateAction(false);
                }}
              >
                <a
                  href="#"
                  className={
                    (!showCreateAction
                      ? "text-yellow-400 border-yellow-400"
                      : "hover:text-gray-600 hover:border-gray-300") +
                    " inline-block p-4 rounded-t-lg border-b-2 border-transparent"
                  }
                >
                  Settings
                </a>
              </li>
              <li
                className="mr-2"
                onClick={() => {
                  setShowCreateAction(true);
                }}
              >
                <a
                  href="#"
                  className={
                    (showCreateAction
                      ? "text-yellow-400 border-yellow-400"
                      : "hover:text-gray-600 hover:border-gray-300") +
                    " inline-block p-4 rounded-t-lg border-b-2 border-transparent"
                  }
                >
                  Permissions
                </a>
              </li>
            </ul>
          </div>
          <div className="flex">
            {!showCreateAction ? (
              <div className="flex flex-col flex-grow justify-between m-5">
                <div>
                  <label className="block mb-2 text-xs font-medium">
                    Role Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="name"
                    className="block w-[300px] p-2 border rounded-lg sm:text-xs hover:border-yellow-500 focus:outline-none focus:border-yellow-500 focus:ring-yellow-500"
                    placeholder="Resource Name"
                    required
                  />
                </div>
                <div className="flex flex-grow flex-row justify-end items-center">
                  <button className="bg-black rounded-md px-6 py-2 text-white text-xs">
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col flex-grow justify-between m-5">
                <div className="flex flex-col">
                  {resources?.map(resource => {
                    return (
                      <Permission resource={resource} role={role}/>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* <Create_Model
          title="Create a Resource"
          isVisible={showModal}
          onClose={() => {
            setShowModel(false);
          }}
        >
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Resource Name
            </label>
            <input
              type="text"
              value={action.name}
              onChange={(e) =>
                setAction({
                  name: e.target.value,
                  action_key: action.action_key,
                })
              }
              id="name"
              className="block w-full p-2 text-gray-50 border border-gray-500 rounded-lg bg-gray-600 sm:text-xs focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Resource Name"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Resource Key
            </label>
            <input
              type="text"
              value={action.action_key}
              onChange={(e) =>
                setAction({ name: action.name, action_key: e.target.value })
              }
              id="key"
              className="block w-full p-2 text-gray-50 border border-gray-500 rounded-lg bg-gray-600 sm:text-xs focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Resource Name"
            />
          </div>
          <div className="flex flex-grow flex-row justify-end items-center">
            <button
              className="bg-yellow-500 rounded-md px-6 py-2 text-white text-xs"
              onClick={() => {
                submitAction();
              }}
            >
              Create
            </button>
          </div>
        </Create_Model> */}
      </div>
    </div>
  );
}


const Permission = ({resource, role}:any) => {
  return (
    <div className="flex flex-col gap-5 border border-bg-200 rounded p-5 mt-5">
      <div className="flex flex-grow justify-start text-lg font-semibold">
        {resource.name}
      </div>
      <div>
      <Select/>
      </div>
    </div>
  )
}
