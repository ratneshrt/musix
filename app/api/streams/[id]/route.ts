import { prismaClient } from "@/app/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(req: NextRequest) {
    const streamId = req.nextUrl.pathname.split('/').pop(); // 
    if (!streamId) {
        return NextResponse.json({
            message: "Stream ID is required"
        }, {
            status: 411
        });
    }

    try {
        // Attempt to delete the stream from the database
        await prismaClient.stream.delete({
            where: {
                id: streamId
            }
        });
        return NextResponse.json({
            message: "Stream deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting stream:", error);
        return NextResponse.json({
            message: "Stream not found",
        }, { status: 404 });
    }
}
