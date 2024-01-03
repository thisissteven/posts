import React from 'react'

import { Footer } from './Footer'
import { Overlay } from './Overlay'
import { Sidebar } from './Sidebar'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background antialiased">
      <style jsx>{`
        #container {
          display: grid;
          grid-template-columns: minmax(60px, 290px) minmax(604px, 1fr) 300px;
          width: 100%;
          max-width: calc(290px + 604px + 300px);
          margin: 0 auto;
          min-height: 100vh;
          min-height: 100dvh;
        }

        @media (max-width: 960px) {
          #container {
            grid-template-columns: 60px 1fr 300px;
          }
        }

        @media (max-width: 781px) {
          #container {
            grid-template-columns: 60px 1fr;
          }
        }

        @media (max-width: 522px) {
          #container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <div id="container" className="text-primary">
        <Overlay />
        <Sidebar />
        <main className="border-x border-x-divider max-xs:border-none max-xs:pb-[60px]">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  )
}
