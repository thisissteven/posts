import { gql, request } from 'graphql-request'
import Image from 'next/image'
import React from 'react'
import useSWR from 'swr'

import { LinkButton } from '@/components/UI'

const document = gql`
  query FooterPostsOpenRolesQuery($count: Int) {
    publishedJobListings(first: $count) {
      edges {
        node {
          id
          ...FooterOpenRolesRow_jobListing
        }
      }
    }
  }
  fragment FooterOpenRolesRow_jobListing on JobListing {
    id
    title
    team {
      teamName
      username
      profilePhotoURL
      id
    }
    companyName
    companyURL
    companyLogo
  }
`

type Job = {
  node: {
    id: string
    title: string
    companyName: string
    companyLogo: string
    team?: Team
  }
}

type Team = {
  teamName: string
  username: string
  profilePhotoURL: string
  id: string
}

type JobListingResponse = {
  publishedJobListings: {
    edges: Job[]
  }
}

export function JobListings() {
  const { data } = useSWR('job-listings', async () => {
    const response = await request({
      url: 'https://maitake-project.uc.r.appspot.com/graphql',
      document,
      variables: {
        count: 10,
      },
    })
    return response as JobListingResponse
  })

  const jobListings = data?.publishedJobListings.edges.slice(0, 5)

  return (
    <div className="m-6 pt-3 pb-2 rounded-xl border border-divider">
      <p className="ml-3 text-xs font-light tracking-wide text-span">
        Active job listings
      </p>

      <div className="my-2">
        <ul>
          {jobListings?.map((data) => {
            return <ListingItem key={data.node.id} {...data} />
          })}
        </ul>
        <div className="mt-4 flex gap-2 px-3">
          <LinkButton href="https://read.cv/open-roles" variant="filled">
            See all
          </LinkButton>
          <LinkButton
            variant="filled"
            href="https://read.cv/about/job-listings"
          >
            Post a job
          </LinkButton>
        </div>
      </div>
    </div>
  )
}

type ListingItemProps = {
  companyOrTeamLogo: string
  companyOrTeamName: string
  jobListingUrl: string
  jobRole: string
}

function ListingItem(data: Job) {
  const props = getListingItemProps(data)

  if (!props) {
    return null
  }

  const { companyOrTeamLogo, companyOrTeamName, jobListingUrl, jobRole } = props

  return (
    <a
      href={jobListingUrl}
      target="_blank"
      className="py-1.5 px-3 flex items-center gap-2 hover:bg-divider active:bg-divider"
    >
      <div className="shrink-0 bg-background rounded-full w-6 h-6 overflow-hidden">
        {companyOrTeamLogo ? (
          <Image
            src={companyOrTeamLogo}
            alt={companyOrTeamName}
            width={24}
            height={24}
          />
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            className="w-6 h-6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16 16H0V0H16V16ZM11.8437 10.8927C12.383 11.3431 12.383 12.1569 11.8437 12.6073C10.8027 13.4768 9.46243 14 8 14C6.53757 14 5.19734 13.4768 4.15629 12.6073C3.61696 12.1569 3.61696 11.3431 4.15629 10.8927C5.19734 10.0232 6.53757 9.5 8 9.5C9.46243 9.5 10.8027 10.0232 11.8437 10.8927ZM10 6C10 7.10457 9.10457 8 8 8C6.89543 8 6 7.10457 6 6C6 4.89543 6.89543 4 8 4C9.10457 4 10 4.89543 10 6Z"
              fill="#333"
            ></path>
          </svg>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-span text-xs font-light tracking-wide">
          {companyOrTeamName}
        </span>
        <span className="text-xs font-light tracking-wide line-clamp-1">
          {jobRole}
        </span>
      </div>
    </a>
  )
}

function getTeamProfileURL(team: Team) {
  try {
    const prefix = team?.profilePhotoURL.split('?')[0]
    const imageId = prefix.replace(
      'https://firebasestorage.googleapis.com/v0/b/maitake-project.appspot.com/o/',
      ''
    )
    const imageUrl = `https://res.cloudinary.com/read-cv/image/upload/c_fill,h_24,w_24/dpr_2.0/v1/1/${imageId}?_a=ATO2BAA0`
    return imageUrl
  } catch (err) {
    return ''
  }
}

function getTeam(id: string, jobRole: string, team: Team): ListingItemProps {
  const role = jobRole.toLowerCase().split(' ').join('-')
  const suffix = id.split('/')

  return {
    companyOrTeamLogo: getTeamProfileURL(team),
    companyOrTeamName: team.teamName,
    jobListingUrl: `https://read.cv/teams/${team.teamName
      .toLowerCase()
      .replace(' ', '-')}/${role}-${suffix[suffix.length - 1]}`,
    jobRole: jobRole,
  }
}

function getCompany(data: Job): ListingItemProps {
  const { companyName, companyLogo, title, id } = data.node

  const prefix = companyLogo.split('?')[0]
  const imageId = prefix.replace(
    'https://firebasestorage.googleapis.com/v0/b/maitake-project.appspot.com/o/',
    ''
  )
  const imageUrl = `https://res.cloudinary.com/read-cv/image/upload/c_fill,h_24,w_24/dpr_2.0/v1/1/${imageId}?_a=ATO2BAA0`

  const role = title.toLowerCase().replace(' ', '-')
  const suffix = id.replace('listings/', '')

  return {
    companyOrTeamLogo: imageUrl,
    companyOrTeamName: companyName,
    jobListingUrl: `https://read.cv/open-roles/${companyName
      .toLowerCase()
      .replace(' ', '')
      .replace('&', '-')
      .split(' ')
      .join('-')}-${role}-${suffix}`,
    jobRole: title,
  }
}

function getListingItemProps(data: Job): ListingItemProps | null {
  const { companyName, companyLogo, title, team, id } = data.node

  const isTeam = !!team
  if (isTeam) {
    return getTeam(id, title, team)
  }

  const isCompany = !!companyLogo && !!companyName
  if (isCompany) {
    return getCompany(data)
  }

  return null
}
