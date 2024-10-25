import { AppBar } from "@/app/component/AppBar"
import StreamView from "@/app/component/StreamView"
import { prismaClient } from "@/app/lib/db"

export default async function({
    params: {
        creatorId
    }
}: {
    params: {
        creatorId: string
    }
}) {

    const user = await prismaClient.user.findFirst({
        where: {
            id: creatorId
        }
    })

    const name = user?.name ?? ""
    const image = user?.userImage ?? ""
    const firstName = name.split(" ")[0]
    const greetings = [
        `Welcome to the party! ${firstName} is ready to vibe with you!`,
        `Hey there! ${firstName} has been waiting to drop the beats!`,
        `Join the fun! ${firstName} has the playlist primed and ready!`,
        `You made it! ${firstName} is all set to turn up the music!`,
        `Party alert! ${firstName} is excited to share the stage with you!`
    ];
    const randomGreet = greetings[Math.floor(Math.random() * greetings.length)]


    return (
        <>
            <AppBar />
            <div className="min-h-screen bg-black text-white font-['Gotham_SSm_A','Gotham_SSm_B',sans-serif]">
                <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8 tracking-tighter flex items-center max-w-xl overflow-hidden whitespace-normal break-words">
                    <div className="pr-4">
                        <img className="h-12 w-12 rounded-full max-w-lg" src={image} alt={`${name}'s profile`}></img>
                    </div>
                    {randomGreet}
                </h1>
                <StreamView creatorId={creatorId} playVideo={false}/>
                </div>
            </div>
        </>
    )
}