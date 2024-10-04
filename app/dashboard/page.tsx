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

  const creatorId = details?.id
  
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
          <h1 className="text-4xl font-bold mb-8 tracking-tighter">Gotham's Music Stream</h1>
          <StreamView creatorId={creatorId} playVideo={true}/>
        </div>
      </div>
    </AuthGuard>
  )
}