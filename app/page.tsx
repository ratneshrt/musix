import { Moon, Users, Zap } from "lucide-react"
import Link from "next/link"
import { AppBar } from "./component/AppBar"
import { HomePageButton } from "./component/HomePageButton"

export default function LandingPage() {
  return (
    <>
      <header className="border-b border-red-800">
        <AppBar />
      </header>
      <div className="flex flex-col min-h-screen bg-black text-white scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full">
        <main className="flex-1 w-full mx-auto max-w-7xl px-4 md:px-6">
          <section className="py-12 md:py-24 lg:py-32 xl:py-48 text-center">
            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  The Night is Yours
                </h1>
                <p className="mx-auto max-w-xl text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Musix: Where the shadows of Gotham meet the beats of your stream. Let your fans be the vigilantes your music deserves.
                </p>
              </div>
              <div className="w-full max-w-sm mx-auto space-y-2">
                <HomePageButton />
              </div>
            </div>
          </section>

          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white mx-auto max-w-3xl">
            The night is darkest just before the dawn. And I promise you, the dawn is coming.
          </h2>

          <section id="features" className="py-12 md:py-24 lg:py-32">
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2">
                <Users className="h-8 w-8 mb-2 text-red-600" />
                <h2 className="text-xl font-bold text-center">Shadow Network</h2>
                <p className="text-gray-400 text-center">
                  Your audience becomes your eyes and ears in the musical underworld.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Moon className="h-8 w-8 mb-2 text-red-600" />
                <h2 className="text-xl font-bold text-center">Bat-Signal Voting</h2>
                <p className="text-gray-400 text-center">Fans light up the sky with their musical emergencies.</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Zap className="h-8 w-8 mb-2 text-red-600" />
                <h2 className="text-xl font-bold text-center">Swift Justice</h2>
                <p className="text-gray-400 text-center">
                  Playlist changes faster than the Dark Knight's gadgets.
                </p>
              </div>
            </div>
          </section>

          <section className="py-12 md:py-24 lg:py-32">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">
              The Bat Protocol
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-full border border-red-600 flex items-center justify-center text-2xl font-bold mb-2 text-red-600">
                  1
                </div>
                <h3 className="text-xl font-bold text-center">Establish Your Batcave</h3>
                <p className="text-gray-400 text-center">Set up your streaming sanctuary.</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-full border border-red-600 flex items-center justify-center text-2xl font-bold mb-2 text-red-600">
                  2
                </div>
                <h3 className="text-xl font-bold text-center">Summon Your Allies</h3>
                <p className="text-gray-400 text-center">
                  Fans join your crusade against musical mediocrity.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-full border border-red-600 flex items-center justify-center text-2xl font-bold mb-2 text-red-600">
                  3
                </div>
                <h3 className="text-xl font-bold text-center">Unleash Sonic Vengeance</h3>
                <p className="text-gray-400 text-center">The chosen tracks echo through Gotham's streets.</p>
              </div>
            </div>
          </section>

          <section className="py-12 md:py-24 lg:py-32 border-t border-red-800">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Answer the Call of Gotham's Nightlife
              </h2>
              <p className="mx-auto max-w-lg text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join Musix today and let your fans be the heroes Gotham's music scene needs.
              </p>
            </div>
          </section>
        </main>

        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-red-800">
          <p className="text-xs text-gray-400">© 2023 Musix. All rights reserved in the shadows of Gotham.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-red-600" href="#">
              Vigilante Code
            </Link>
            <Link className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-red-600" href="#">
              Shadow Protocol
            </Link>
          </nav>
        </footer>
      </div>
    </>
  )
}
