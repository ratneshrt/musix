import { AppBar } from "@/app/component/AppBar"
import StreamView from "@/app/component/StreamView"
import { prismaClient } from "@/app/lib/db"
import { getServerSession } from "next-auth"

export default async function({
    params: {
        creatorId
    }
}: {
    params: {
        creatorId: string
    }
}) {


    return (
        <>
            <AppBar />
            <div className="min-h-screen bg-black text-white font-['Gotham_SSm_A','Gotham_SSm_B',sans-serif]">
                <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8 tracking-tighter">Gotham's Music Stream</h1>
                <StreamView creatorId={creatorId} playVideo={false}/>
                </div>
            </div>
        </>
    )
}