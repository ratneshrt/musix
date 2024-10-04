"use client"

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown, Share2, Play } from "lucide-react";
import { YT_REGEX } from "@/app/lib/utils"; 
import { Card, CardContent } from "@/components/ui/card"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
//@ts-expect-error
import YouTubePlayer from 'youtube-player'

interface Video{
    id: string,
    type: string,
    url: string,
    title: string,
    smallImg: string,
    OrgImg: string,
    extractedId: string,
    active: boolean,
    userId: string,
    upvotes: number,
    haveUpVoted: boolean
}

const REFRESH_INTERVAL_MS = 10 * 1000

export default function StreamView({
    creatorId,
    playVideo = false,
}:{
    creatorId : string,
    playVideo: boolean,
}){
    const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
    const [inputLink, setInputLink] = useState('')
    const [loading, setLoading] = useState(false)
    const [queue, setQueue] = useState<Video[]>([])
    const [previewVideoId, setPreviewVideoId] = useState<string | null>(null)
    const [playNextLoader, setPlayNextLoader] = useState(false)
    const videoPlayerRef = useRef<HTMLDivElement>(null);

    async function refreshStreams(){
        const res = await fetch(`/api/streams/?creatorId=${creatorId}`, {
          credentials: "include"
        })
        if(!res.ok){
          console.log("Failed to fetch streams: ", res.status, res.statusText)
          return
        }
        const json = await res.json();
        setQueue(json.streams.sort((a: any, b: any) => b.upvotes - a.upvotes))
        setCurrentVideo(video => {
          if(video?.id === json.activeStream?.stream?.id){
            return video
          }
          return json.activeStream.stream
        })
        
  }

    useEffect(() => {
        refreshStreams();
        const interval = setInterval(() => {
            refreshStreams();
        }, REFRESH_INTERVAL_MS)
    }, [])


    useEffect(() => {
      if(!videoPlayerRef.current){
        return
      }
      const player = YouTubePlayer(videoPlayerRef.current)
      player.loadVideoById(currentVideo?.extractedId)
      player.playVideo()
      async function eventHandler(event: any){
        console.log(event)
        console.log(event.data)
        if(event.data === 0){
          if(currentVideo){
            await fetch(`/api/streams/${currentVideo.id}`, {
              method: "DELETE"
            })
          }
          playNext()
        }
      }
      player.on('stateChange', eventHandler)
      return () => {
        player.destroy()
      }
    }, [currentVideo, videoPlayerRef])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        const existingvideo = queue.find(video => 
          video.extractedId === extractYoutubeVideoId(inputLink)
        )
        if(existingvideo){
          toast.error('Video is already added!', {
            position: "top-left",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setLoading(false)
          return
        }
        const res = await fetch("/api/streams/", {
            method: "POST",
            body: JSON.stringify({
                creatorId,
                url: inputLink
            })
        })
        setQueue([...queue, await res.json()])
        setLoading(false)
        setInputLink('')
    }

    const extractYoutubeVideoId = (url: string) => {
        const match = url.match(YT_REGEX)
        return match ? match[1] : null
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const link = e.target.value
        setInputLink(link)
        const videoId = extractYoutubeVideoId(link)
        setPreviewVideoId(videoId)
    }

    const handleVote = (id: string, isUpvote: boolean) => {
        setQueue(queue.map(video => 
            video.id === id
            ? {
                ...video,
                isUpvote: isUpvote ? video.upvotes + 1 : video.upvotes - 1,
                haveUpvoted: !video.haveUpVoted
            } : video
        ).sort((a,b) => (b.upvotes) - (a.upvotes)))

        fetch(`/api/streams/${isUpvote ? "upvote" : "downvote"}`,{
            method: "POST",
            body: JSON.stringify({
                streamId: id
            })
        })
    }

    const playNext = async () => {
      if(queue.length === 0){
        if(currentVideo){
          await fetch(`/api/streams/${currentVideo.id}`, {
            method: "DELETE"
          })
        }
        setCurrentVideo(null)
        toast.info('No more videos to play.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
      if (queue.length > 0) {
        try {
            setPlayNextLoader(true)
            const currentStreamId = currentVideo?.id
            const data = await fetch(`/api/streams/next`, {
              method: "GET"
            })
            const json = await data.json();
            if(json.stream){
              setCurrentVideo(json.stream)
              setQueue(q => q.filter(x => x.id !== json.stream?.id))
            }else{
              setCurrentVideo(null)
            }
        } catch(e) {
          console.error('Error while playing next video ' + e)
        }finally{
          setPlayNextLoader(false)
        } 
      }
  }

    const handleShare = () => {
      const shareableLink = `${window.location.origin}/creator/${creatorId}`
      navigator.clipboard.writeText(shareableLink).then(() => {
        toast.success('Link copied to clipboard!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      }, (err) => {
        console.error('Could not copy text: ', err)
        toast.error('Failed to copy link. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      })
    }

    return (
      <>
      <div className="flex flex-col lg:flex-row gap-8 ">
        {/* Left Column */}
        <div className="w-full lg:w-1/2 space-y-8">
          {/* Current playing video */}
          <div>
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold mb-4 tracking-tight">Now Playing</h2>
              <Button onClick={handleShare} className="bg-white text-black hover:bg-white/90 font-bold">
                  <Share2 className="mr-2"/>
                  Share
              </Button>
            </div>
            <Card className="bg-black border-gray-800">
                <CardContent className="p-4">
                    {currentVideo ? (
                        <div>
                            {playVideo ? (<>
                            {/**/}
                                <div ref={videoPlayerRef} className='w-full' /> 
                            </>) : <>
                            <img 
                                src={currentVideo.OrgImg} 
                                className="w-full h-72 object-cover rounded"
                            />
                            <p className="mt-2 text-center font-semibold text-white">{currentVideo.title}</p>
                        </>}
                    </div>) : (
                        <p className="text-center py-8 text-gray-400">No video playing</p>
                    )}
                </CardContent>
              </Card>
            <div className="pt-4 ">
            {playVideo && <Button onClick={playNext} disabled={playNextLoader} className="bg-white text-black hover:bg-white/90 font-bold w-full hover:cursor-pointer">
              <Play className="mr-2 h-4 w-4"></Play>
              {playNextLoader ? "Loading..." : "Play Next"}
            </Button>}
            </div>
          </div>
  
          {/* Video submission form */}
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-4 tracking-tight">Submit a Song</h2>
            <div className="flex gap-4">
              <Input
                type="text"
                value={inputLink}
                onChange={handleInputChange}
                placeholder="Paste YouTube link here"
                className="flex-grow bg-white/5 border-white/20 text-white placeholder-white/50"
              />
              <Button
                disabled={loading}
                type="submit"
                className="bg-white text-black hover:bg-white/90 font-bold"
              >
                {loading ? "Loading" : "Add to Queue"}
              </Button>
            </div>
              {/* Youtube Preview */}
              {previewVideoId && (
                  <div className="aspect-video bg-white/5 mt-4">
                      <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${previewVideoId}?controls=0&showinfo=0&autohide=1&rel=0`}
                      allow="clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      ></iframe>
                  </div>
              )}
          </form>
        </div>
  
        {/* Right Column - Queue */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-bold mb-4 tracking-tight">Up Next</h2>
          <ul className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full">
            {queue.length === 0 && <Card className="bg-black border-gray-800">
              <CardContent className="p-4">
              <p className="text-center py-8 text-gray-400">No videos in queue</p>
              </CardContent>
              </Card>}
            {queue.map(video => (
              <li key={video.id} className="flex items-center gap-4 bg-white/5 p-4 rounded">
                <div className="flex-shrink-0 w-24 h-18 bg-white/10 rounded overflow-hidden">
                  <img src={video.smallImg} alt={video.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold tracking-tight">{video.title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVote(video.id, video.haveUpVoted ? false : true)}
                    className="bg-white text-black hover:bg-white/90 w-8 h-8 p-0"
                  >
                    {video.haveUpVoted ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </Button>
                  <span className="text-lg font-bold w-8 text-center">{video.upvotes}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
      />
      </div>
      </>
    );
}
