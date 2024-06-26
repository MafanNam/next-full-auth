"use client";

import Link from "next/link"
import {Button} from "@/components/ui/button"
import {SheetTrigger, SheetContent, Sheet} from "@/components/ui/sheet"
import {JSX, SVGProps} from "react"
import {ModeToggle} from "@/components/ui/ModeToggle";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {logout as setLogout,} from "@/lib/features/auth/authSlice";
import {useLogoutMutation, useRetrieveUserQuery} from "@/lib/features/auth/authApiSlice";
import {useRouter} from "next/navigation";
import Spinner from "@/components/common/Spinner";

export function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [logout] = useLogoutMutation();

  const {isAuthenticated, isLoading} = useAppSelector(state => state.auth)

  const {data: user, isLoading: isLoadingData} = useRetrieveUserQuery()
  if (isLoadingData) return <Spinner size={20}/>

  const handleLogout = () => {
    logout(undefined)
      .unwrap()
      .then(() => {
        dispatch(setLogout());
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        router.push("/");
      })
  }

  const authLinks = (
    <>
      {user?.type_profile === 'Recruiter' &&
        <Link className="text-lg font-medium hover:underline underline-offset-4" href="/candidate">
          Candidate
        </Link>
      }
      <Link className="text-lg font-medium hover:underline underline-offset-4" href="/dashboard">
        Dashboard
      </Link>
      <span role='button' className="text-lg font-medium hover:underline underline-offset-4" onClick={handleLogout}>
        Logout
      </span>
    </>
  )

  const guestLinks = (
    <>
      <Link className="text-lg font-medium hover:underline underline-offset-4" href="/auth/login">
        Login
      </Link>
      <Link className="text-lg font-medium hover:underline underline-offset-4" href="/auth/register">
        Register
      </Link>
    </>
  )

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white dark:bg-fuchsia-950 dark:bg-opacity-20">
      <Link className="flex items-center gap-2" href="/">
        <MountainIcon className="h-6 w-6"/>
        <span className="text-lg font-semibold">Auth System</span>
        {isAuthenticated && <h1>Hi {user?.first_name} {user?.last_name}</h1>}
      </Link>
      <div className="hidden md:flex gap-4">
        <Link className="text-lg font-medium hover:underline underline-offset-4" href="/">
          Home
        </Link>
        {isLoading ? <Spinner size={25}/> :
          isAuthenticated ? authLinks : guestLinks
        }

        <div className="text-lg font-medium">
          <ModeToggle/>
        </div>

      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="lg:hidden" size="icon" variant="outline">
            <MenuIcon className="h-6 w-6"/>
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="grid w-[200px] p-4">
            <Link className="text-lg font-medium hover:underline underline-offset-4" href="/">
              Home
            </Link>
            {isAuthenticated ? authLinks : guestLinks}

            <div className="text-lg font-medium">
              <ModeToggle/>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  )
}


function MountainIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
    </svg>
  )
}


function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12"/>
      <line x1="4" x2="20" y1="6" y2="6"/>
      <line x1="4" x2="20" y1="18" y2="18"/>
    </svg>
  )
}
