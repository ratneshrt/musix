import { Image } from "@/app/component/Image";
import { SignIn } from "@/app/component/SignIn";

export default function Signin(){
    return (
        <>  
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="hidden lg:block">
                    <Image />
                </div>
                <div>
                    <div className="flex bg-black lg:hidden pb-16 pt-4">
                        <img src="https://i.postimg.cc/d1kxY86q/logo-2.png" className="max-h-28 px-4"></img>
                    </div>
                        <SignIn />
                </div>
                </div>
        </>
    )
}