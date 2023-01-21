import { faPlus, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState, useEffect } from "react";
import { routes } from "../../src/routes";
import { IActionsReslut, IResourcesReslut, IRolesReslut } from "../../src/interfaces";
import Select from 'react-select';
import { useSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";

const Role = ({ roleResult, resourcesResult }: { roleResult: IRolesReslut, resourcesResult: IResourcesReslut[] }) => {

  const [role, setRole] = useState<IRolesReslut>(roleResult);
  const [showCreateAction, setShowCreateAction] = useState(false);
  const [resources, setResources] = useState<IResourcesReslut[]>(resourcesResult)
  const [name, setName] = useState(roleResult.name);
  const [showModal, setShowModel] = useState(false);

  return (
    <div className="">
      <div className="flex flex-col ">
        <div className="flex flex-grow justify-between items-start w-[100hv] h-[50px] mx-8 my-4">
          <div className="flex flex-row justify-between items-center gap-5">
            <Link href={"/role"}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </Link>
            <h1 className="font-sans text-xl font-bold">{role.name}</h1>
            <div className="text-gray-500 text-sm">
              {role?.role_key}
            </div>
          </div>
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
              <div className="flex flex-col flex-grow justify-between m-5 overflow-y-auto">
                <div className="flex flex-col">
                  {resources?.map(resource => {
                    return (
                      <Permission resource={resource} role={role} key={resource.resource_key} />
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export type ActionOption = {
  label: string,
  value: string,
  id: string,
}

const Permission = ({ resource, role }: any) => {
  const [actions, setActions] = useState<IActionsReslut[]>()
  const [actionOptions, setActionOptions] = useState<ActionOption[]>([])
  const [selectedOptions, setSelectedOptions] = useState<ActionOption[]>([])
  const [patchAddActions, setPatchAddActions] = useState<ActionOption[]>([])
  const [patchRemoveActions, setPatchRemoveActions] = useState<ActionOption[]>([])
  const [assignedActionOptions, setAssignedActionOptions] = useState<ActionOption[]>([])
  const [isChangeHappened, setIsChangeHappened] = useState(false)

  // const router = useRouter();
  const { status, data } = useSession();

  useEffect(() => {
    fetchActions()
  }, [!actions])
  useEffect(() => {
    fetchAllowedActions()
  }, [!actions])

  const fetchActions = async () => {

    await fetch(`${process.env.BASE_API}/${resource.resource_id}/action`, {
      headers: {
        Authorization: `Bearer ${data?.accessToken}`,
        "Content-Type": "application/json ; charset=utf8",
      },
    })
      .then((res) => {
        if (res.status === 401) {
          // router.push("/auth/signin");
        }
        return res.json();
      })
      .then((data) => {
        setActions(data.results)
      })
    const options = actions?.map(action => {
      return { label: action.name, value: action.action_key, id: action.action_id }
    })
    if (options) {
      setActionOptions(options)
    }
  }

  const fetchAllowedActions = async () => {

    const actions_keys = actions?.map(action => action.action_key)
    if (actions) {
      await fetch(routes.permission + `/check_actions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${data?.accessToken}`,
          "Content-Type": "application/json ; charset=utf8",
        },
        body: JSON.stringify({ role: role.role_key, resource: resource.resource_key, actions: actions_keys })
      })
        .then((res) => {
          if (res.status === 401) {
            // router.push("/auth/signin");
          }
          return res.json();
        })
        .then((data) => {
          console.log(data)
          if (data && data.length > 0){
            const options = data?.map((val: string) => {
              const action = actions.find(action => action.action_key === val)
              if (action) {
                return { label: action.name, value: action.action_key, id: action.action_id }
              }
            })
            if (options) {
              setSelectedOptions(options)
              setAssignedActionOptions(options)
            }
          }
        })
    }
  }

  function getDifference(a: ActionOption[], b: ActionOption[]): ActionOption[] {
    return a.filter(element1 => {
      return !b.some(element2 => {
        return element1.value === element2.value;
      });
    });
  }

  function handleSelect(data: any) {
    if (selectedOptions.length == 0) {
      setPatchRemoveActions([])
      setPatchAddActions(data)
    } else {
      if (data.length == 0) {
        let removedOption = getDifference(selectedOptions, [])[0];
        var array = [...patchAddActions];
        var index = array.indexOf(removedOption)
        if (index !== -1) {
          array.splice(index, 1);
          setPatchAddActions(array);
        } else {
          setPatchRemoveActions(prev => {
            prev.push(removedOption)
            return [...prev]
          })
        }
      } else {
        if (selectedOptions.length < data.length) {
          let addedOption = getDifference(data, selectedOptions)[0];
          var array = [...patchRemoveActions];
          var index = array.indexOf(addedOption)
          if (index !== -1) {
            array.splice(index, 1);
            setPatchRemoveActions(array);
          }
          var array = [...patchAddActions];
          var index = array.indexOf(addedOption)
          if (index !== -1) {

          } else {
            setPatchAddActions(prev => {
              prev.push(addedOption)
              return [...prev]
            })
          }
        } else {
          let removedOption = getDifference(selectedOptions, data)[0];
          var array = [...patchAddActions];
          var index = array.indexOf(removedOption)
          if (index !== -1) {
            array.splice(index, 1);
            setPatchAddActions(array);
          } else {
            setPatchRemoveActions(prev => {
              prev.push(removedOption)
              return [...prev]
            })
          }

        }
      }
    }

    setSelectedOptions(data);
    const selected = [...data]
    const assigned = [...assignedActionOptions]
    if (selected.length > assigned.length) {
      const diff = getDifference(selected, assigned)
      if (diff.length > 0) {
        setIsChangeHappened(true)
      } else {
        setIsChangeHappened(false)
      }
    } else {
      const diff = getDifference(assigned, selected)
      if (diff.length > 0) {
        setIsChangeHappened(true)
      } else {
        setIsChangeHappened(false)
      }
    }
  }

  const updatePermission = async () => {
    const addActions = getDifference(patchAddActions, assignedActionOptions);
    const patchRequest = {
      operations: [
        {
          op: "add",
          permisssions: addActions.map(action => ({ role: role.role_key, resource: resource.resource_key, action: action.value }))
        },
        {
          op: "remove",
          permisssions: patchRemoveActions.map(action => ({ role: role.role_key, resource: resource.resource_key, action: action.value }))
        },
      ]
    }
    await fetch(routes.permission + `/update`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${data?.accessToken}`,
        "Content-Type": "application/json ; charset=utf8",
      },
      body: JSON.stringify(patchRequest)
    })
    fetchAllowedActions()
    setIsChangeHappened(false)

  }

  return (
    <div className="flex flex-col gap-5 border border-bg-200 rounded p-5 mt-5">
      <div className="flex flex-grow justify-start text-lg font-semibold">
        {resource.name}
      </div>
      <div className="z-1">
        <Select options={actionOptions} isMulti value={selectedOptions} onChange={handleSelect} />
      </div>
      <div className='flex flex-grow flex-row justify-end items-center'>
        <button className={`${isChangeHappened ? "bg-black " : "bg-gray-500 "} rounded-md px-6 py-2 text-white text-xs`} onClick={isChangeHappened ? () => updatePermission() : () => { }}>
          Save Changes
        </button>
      </div>
    </div>
  )
}

export async function getServerSideProps({ params, res }: any) {

  const session = await getToken({ req: res.req });

  const response = await fetch(
    `${process.env.BASE_API}/${session?.org_id}/role` + `/${params.ro_id}`,
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

  const roleResult = await response.json();

  // Fetch all resources.
  const response2 = await fetch(
    `${process.env.BASE_API}/${session?.org_id}/resource`,
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

  const resourcesResult = await response2.json();

  return {
    props: {
      roleResult: roleResult,
      resourcesResult: resourcesResult.results
    },
  };
}

export default Role;
