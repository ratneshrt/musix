import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod'
import { prismaClient } from "@/app/lib/db"
//@ts-expect-error
import youtubesearchapi from 'youtube-search-api'
import { getServerSession } from "next-auth";
import { YT_REGEX } from "@/app/lib/utils";

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string() 
})

const MAX_QUEUE_LEN = 20

export async function POST(req: NextRequest){
    try{
        const data = CreateStreamSchema.parse(await req.json())
        const isYt = data.url.match(YT_REGEX)
        if(!isYt || !isYt[1]){
            return NextResponse.json({
                message: "Wrong URL format"
            },{
                status: 411
            })
        }
        const extractedId = isYt[1];

        const existingStream = await prismaClient.stream.findFirst({
            where: {
                extractedId,
                played: false
            }
        })

        if(existingStream){
            return NextResponse.json({
                message: "This video is already in queue"
            }, {
                status: 411
            })
        }

        const res = await youtubesearchapi.GetVideoDetails(extractedId)


        const existingActiveStream = await prismaClient.stream.count({
            where: {
                userId: data.creatorId,
            }
        })


        if (existingActiveStream > MAX_QUEUE_LEN){
            return NextResponse.json({
                message: "Already at limit"
            }, {
                status: 411
            })
        }

        const smallImg =  `https://img.youtube.com/vi/${extractedId}/default.jpg` || "https://www.catbreedslist.com/stories-images/what-kind-of-cat-breed-is-beluga-800x450.jpg";

        const OrgImg = `https://img.youtube.com/vi/${extractedId}/sddefault.jpg` || "https://www.catbreedslist.com/stories-images/what-kind-of-cat-breed-is-beluga-800x450.jpg";

        const stream = await prismaClient.stream.create({
            data: {
                userId: data.creatorId,
                url: data.url,
                type: "Youtube",
                extractedId,
                title: res.title ?? "Can't find video",
                smallImg,
                OrgImg
            }
        })

        return NextResponse.json({
            ...stream, 
            hasUpvoted: false,
            upvotes: 0,
        })
    }catch(e){
        console.log(e)
        return NextResponse.json({
            message: "Error while adding a stream" + " " + e
        },{
            status: 411
        })
    }

}

export async function GET(req: NextRequest){
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const session = await getServerSession();
    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    })
    if(!user){
        return NextResponse.json({
            message: "Unauthenticated"
        }, {
            status: 403
        })
    }
    if(!creatorId){
        return NextResponse.json({
            message: "Error"
        }, {
            status: 411
        })
    }
    const [streams, activeStream] = await Promise.all([prismaClient.stream.findMany({
        where: {
            userId: creatorId,
            played: false
        }, 
        include: {
            _count: {
                select: {
                    upvotes: true
                }
            }, upvotes: {
                where: {
                    userId: user.id
                }
            }
        }
    }), prismaClient.currentStream.findFirst({
        where: {
            userId: creatorId
        },
        include: {
            stream: true
        }
    })])

    return NextResponse.json({
        streams: streams.map(({_count, ...rest}) => ({
            ...rest,
            upvotes: _count.upvotes,
            haveUpVoted: rest.upvotes.length ? true : false
        })),
        activeStream
    })
}

