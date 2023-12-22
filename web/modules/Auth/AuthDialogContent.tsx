import clsx from 'clsx'
import { signIn } from 'next-auth/react'
import React from 'react'
import { z } from 'zod'

import { Google, Success } from '@/components/Icons'
import { Input, RegularButton } from '@/components/UI'

import { useAuth } from '.'

function WithGoogle({ onWithEmailClick }: { onWithEmailClick: () => void }) {
  const { signInWithGoogle } = useAuth()

  return (
    <div className="shrink-0 w-full px-6 py-5 grid place-items-center">
      <div>
        <p className="text-lg font-medium">Login to your account 👋</p>
        <p className="mt-1.5 text-soft-primary text-sm">
          By continuing you agree to our{' '}
          <a href="https://read.cv/terms" className="text-primary">
            terms of service
          </a>{' '}
          and{' '}
          <a href="https://read.cv/privacy" className="text-primary">
            privacy policy
          </a>
          .
        </p>
        <RegularButton
          onClick={signInWithGoogle}
          variant="filled"
          className="relative overflow-hidden rounded-lg text-soft-primary text-sm tracking-normal font-normal gap-2 mt-4 flex justify-center items-center w-full"
        >
          <Google /> Continue with Google
        </RegularButton>
        <RegularButton
          onClick={onWithEmailClick}
          variant="underline"
          className="mt-2 py-2 flex justify-center items-center w-full"
        >
          Continue with email
        </RegularButton>
      </div>
    </div>
  )
}

function WithEmail({
  onBackClick,
  onEmailSent,
  emailAddress,
  setEmailAddress,
}: {
  onBackClick: () => void
  onEmailSent: () => void
  emailAddress: string
  setEmailAddress: (emailAddress: string) => void
}) {
  const [isSending, setIsSending] = React.useState(false)

  const { success } = z.string().email().safeParse(emailAddress)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setIsSending(true)
        signIn('email', {
          email: emailAddress,
          redirect: false,
        })
          .then(onEmailSent)
          .finally(() => setIsSending(false))
      }}
      className="shrink-0 w-full px-6 py-5"
    >
      <p className="text-lg font-medium">Continue with an email link 💌</p>
      <p className="mt-1.5 text-soft-primary text-sm">
        Enter your email and we'll send you a link to login to your account.
      </p>
      <div className="relative mt-4">
        <Input
          placeholder="Email address"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
        />
        <div
          className={clsx(
            'absolute animate-in origin-center right-3 top-1/2 -translate-y-1/2 transition',
            success ? 'opacity-100 scale-125' : 'opacity-0 scale-0'
          )}
        >
          <Success />
        </div>
      </div>
      <div className="mt-4 flex gap-2 items-center justify-end">
        <RegularButton
          type="button"
          onClick={onBackClick}
          variant="underline"
          className="w-fit flex justify-center items-center px-4 py-1.5"
        >
          Back
        </RegularButton>
        <RegularButton
          variant="secondary"
          disabled={!success}
          isLoading={isSending}
          className="disabled:bg-soft-background disabled:text-span"
        >
          Submit
        </RegularButton>
      </div>
    </form>
  )
}

function EmailSent({
  emailAddress,
  onBackClick,
}: {
  emailAddress: string
  onBackClick: () => void
}) {
  const { closeAuthDialog } = useAuth()
  return (
    <div className="shrink-0 flex flex-col justify-between w-full px-6 py-5">
      <div>
        <p className="text-lg font-medium">Check your inbox! 🍄</p>
        <p className="mt-1.5 text-soft-primary text-sm">
          Open the link sent to{' '}
          <span className="text-primary">{emailAddress}</span> in this browser.
        </p>
      </div>
      <div className="mt-4 flex gap-2 items-center justify-end">
        <RegularButton
          onClick={onBackClick}
          variant="underline"
          className="w-fit flex justify-center items-center px-4 py-1.5"
        >
          Back
        </RegularButton>
        <RegularButton variant="secondary" onClick={closeAuthDialog}>
          Done
        </RegularButton>
      </div>
    </div>
  )
}

export function AuthDialogContent() {
  const [currentPage, setCurrentPage] = React.useState(0)
  const [emailAddress, setEmailAddress] = React.useState('')

  return (
    <div className="bg-background overflow-x-hidden">
      <div
        className={clsx(
          'flex duration-300 ease-in-out',
          currentPage === 0 && 'translate-x-0',
          currentPage === 1 && '-translate-x-full',
          currentPage === 2 && '-translate-x-[200%]'
        )}
      >
        <WithGoogle onWithEmailClick={() => setCurrentPage(1)} />
        <WithEmail
          emailAddress={emailAddress}
          setEmailAddress={setEmailAddress}
          onBackClick={() => setCurrentPage(0)}
          onEmailSent={() => setCurrentPage(2)}
        />
        <EmailSent
          emailAddress={emailAddress}
          onBackClick={() => setCurrentPage(1)}
        />
      </div>
    </div>
  )
}
