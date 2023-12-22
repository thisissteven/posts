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
    <div className="m-6 py-2 rounded-xl border border-divider">
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
      <div className="rounded-full w-6 h-6 overflow-hidden">
        <Image
          src={companyOrTeamLogo}
          alt={companyOrTeamName}
          width={24}
          height={24}
        />
      </div>
      <div className="flex flex-col">
        <span className="text-span text-xs font-light tracking-wide">
          {companyOrTeamName}
        </span>
        <span className="text-xs font-light tracking-wide">{jobRole}</span>
      </div>
    </a>
  )
}

function getTeam(id: string, jobRole: string, team: Team): ListingItemProps {
  const prefix = team?.profilePhotoURL.split('?')[0]
  const imageId = prefix.replace(
    'https://firebasestorage.googleapis.com/v0/b/maitake-project.appspot.com/o/',
    ''
  )
  const imageUrl = `https://res.cloudinary.com/read-cv/image/upload/c_fill,h_24,w_24/dpr_2.0/v1/1/${imageId}?_a=ATO2BAA0`

  const role = jobRole.toLowerCase().split(' ').join('-')
  const suffix = id.split('/')

  return {
    companyOrTeamLogo: imageUrl,
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
