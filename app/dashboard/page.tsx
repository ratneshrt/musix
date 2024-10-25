import { getServerSession } from "next-auth";
import { AppBar } from "../component/AppBar";
import { AuthGuard } from "../component/AuthGuard";
import StreamView from "../component/StreamView";
import { prismaClient } from "../lib/db";

export default async function Dashboard() {
  const session = await getServerSession();
  const details = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? ""
    }
  })

  const image = session?.user?.image ?? ""
  const creatorId = details?.id
  const date = new Date()
  const hour = date.getHours()
  const name = session?.user?.name ?? ""
  const firstName = name.split(" ")[0]
  const morning = [`Morning vibes, ${firstName}! Got today’s jam?`, `Rise and play, ${firstName}!`, `Wake up, DJ ${firstName}!`, `Good morning! Set the mood for the day?`, `Kickstart the day with a tune, ${firstName}!`]
  const afternoon = [`Afternoon, ${firstName}! Ready to turn it up?`, `Set the vibe, ${firstName}!`, `What’s next in the queue, ${firstName}?`, `Time to tune in, ${firstName}!`, `Afternoon beats, ${firstName}?`]
  const lateNight = [`Late vibes, ${firstName}! Keep it playing!`, `Still jamming, ${firstName}? Let’s go!`, `Night owl mode: playlist on!`, `After-hours beats, ${firstName}!`, `Party till dawn, ${firstName}?`]

  const randomMorning = morning[Math.floor(Math.random() * morning.length)]
  const randomAfternoon = morning[Math.floor(Math.random() * afternoon.length)]
  const randomNight = morning[Math.floor(Math.random() * lateNight.length)]
  
  if(!creatorId){
    return (
      <p>Loading...</p>
    )
  }

  return(
    <AuthGuard>
      <AppBar />
      <div className="min-h-screen bg-black text-white font-['Gotham_SSm_A','Gotham_SSm_B',sans-serif]">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 tracking-tighter flex items-center max-w-xl overflow-hidden whitespace-normal break-words">
            <div className="pr-4">
              <img className="h-12 w-12 rounded-full max-w-lg" src={image} alt={`${name}' profile`}></img>
            </div>
            {(hour < 12) ? randomMorning : ((hour <=22 && hour >=12) ? randomAfternoon : randomNight)}</h1>
          <StreamView creatorId={creatorId} playVideo={true}/>
        </div>
      </div>
    </AuthGuard>
  )
}