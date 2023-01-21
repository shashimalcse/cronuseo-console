import { getToken } from 'next-auth/jwt'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { IOrgReslut } from '../../src/interfaces'
import { routes } from '../../src/routes'

const Settings = ({ orgResult }: { orgResult: IOrgReslut }) => {
    const [org, setOrg] = useState(orgResult)
    const [copied, setCopied] = useState(false);
    const resetCopy = useRef<NodeJS.Timeout>();

    const onCopy = () => {
        navigator.clipboard
            .writeText(org.org_api_key)
            .then(() => setCopied(true));
    };
    useEffect(() => {
        if (copied) {
            resetCopy.current = setTimeout(
                () => setCopied(false),
                4000,
            );
        }
        return () => {
            clearTimeout(resetCopy.current);
        };
    }, [copied]);
    return (
        <div className='flex flex-col h-full'>
            <div className="flex-none w-[100hv] h-[50px] mx-8 my-4">
                <div className="flex flex-row justify-between items-start">
                    <div className="flex flex-col">
                        <h1 className="font-sans text-xl font-bold">Settings</h1>
                    </div>

                </div>
            </div>
            <div className="flex flex-col flex-grow bg-white mx-5 rounded-lg">
                <div className='m-5'>
                    <h1 className="font-sans text-l text-gray-500 mb-5">API Key</h1>
                    <div className='flex flex-row text-gray-500'>
                        <input
                            type="text"
                            value={org.org_api_key}
                            className="block w-[400px] p-2 border-t-2 border-l-2 border-b-2 rounded-l sm:text-xs font-bold"
                            readOnly
                        />
                        <button
                            className="border-t-2 border-r-2 border-b-2 rounded-r px-6 py-1 text-sm bg-gray-100"
                            onClick={onCopy}
                        >
                            {copied ? 'copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export async function getServerSideProps({ req, res }: any) {

    const session = await getToken({ req: res.req });

    const response = await fetch(
        `${process.env.BASE_API}/organization/${session?.org_id}`,
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

    const orgResult = await response.json();
    return {
        props: {
            orgResult: orgResult,
        },
    };
}

export default Settings;
