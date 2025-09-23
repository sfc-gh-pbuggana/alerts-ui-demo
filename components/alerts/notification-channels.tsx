"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TokenRow, TagToken, AddDestination } from "./notifications"
import { SearchDestination } from "./search-destination"
import { ChevronDown, ChevronRight, Plus, X } from "lucide-react"

// Icon components
const EmailIcon = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 6l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const InAppIcon = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 2a6 6 0 016 6c0 7-6 9-6 9s-6-2-6-9a6 6 0 016-6z" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 15h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const ExternalIcon = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6.5 14.5h7a2 2 0 002-2v-5a2 2 0 00-2-2h-7a2 2 0 00-2 2v5a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 5.5V4a1 1 0 011-1h2a1 1 0 011 1v1.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="10" cy="10" r="1" fill="currentColor"/>
    <path d="M6.5 14.5L4 17M13.5 14.5L16 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

interface NotificationChannelsProps {
  // Email state
  emailUsers: string[]
  selectedEmailRoles: string[]
  emailRolesExpanded: boolean
  emailUsersExpanded: boolean
  setEmailRolesExpanded: (expanded: boolean) => void
  setEmailUsersExpanded: (expanded: boolean) => void
  addEmailUser: (user: string) => void
  removeEmailUser: (user: string) => void
  addEmailRole: (role: string) => void
  removeEmailRole: (role: string) => void
  
  // In-App state
  inAppUsers: string[]
  selectedInAppRoles: string[]
  inAppExpanded: boolean
  inAppRolesExpanded: boolean
  inAppUsersExpanded: boolean
  setInAppExpanded: (expanded: boolean) => void
  setInAppRolesExpanded: (expanded: boolean) => void
  setInAppUsersExpanded: (expanded: boolean) => void
  addInAppUser: (user: string) => void
  removeInAppUser: (user: string) => void
  addInAppRole: (role: string) => void
  removeInAppRole: (role: string) => void
  
  // External state
  externalDestinations: string[]
  externalExpanded: boolean
  setExternalExpanded: (expanded: boolean) => void
  addExternalDestination: (destination: string) => void
  removeExternalDestination: (destination: string) => void
  
  // Options
  roles: string[]
  userOptions: string[]
  externalOptions: string[]
}

export default function NotificationChannels(props: NotificationChannelsProps) {
  const [visibleChannels, setVisibleChannels] = useState<Set<string>>(new Set(['email']))

  // Channel management functions
  const addChannel = (channelType: string) => {
    setVisibleChannels(prev => new Set([...prev, channelType]))
  }

  const removeChannel = (channelType: string) => {
    if (visibleChannels.size > 1) {
      setVisibleChannels(prev => {
        const newSet = new Set(prev)
        newSet.delete(channelType)
        return newSet
      })
    }
  }

  const availableChannels = [
    { id: 'inapp', label: 'In-App', disabled: visibleChannels.has('inapp') },
    { id: 'external', label: 'External', disabled: visibleChannels.has('external') }
  ].filter(channel => !channel.disabled)

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Notification Channels</h3>
      <div className="space-y-6">
        
        {/* Email Section - Always visible */}
        {visibleChannels.has('email') && (
          <div className="space-y-4 border border-gray-300 rounded-lg p-4 bg-gray-50 relative">
            <div className="flex items-center justify-between">
              <button
                onClick={() => props.setEmailRolesExpanded(!props.emailRolesExpanded)}
                className="flex items-center gap-2 text-left hover:text-blue-600 transition-colors"
              >
                <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <EmailIcon className="text-blue-600" />
                  Email (Snowflake Users)
                </h4>
                {props.emailRolesExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
              </button>
              {visibleChannels.size > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-red-600"
                  onClick={() => removeChannel('email')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {props.emailRolesExpanded && (
              <div className="space-y-4 pl-3">
                <div className="space-y-3">
                  <h5 className="text-md font-medium text-gray-700">Roles</h5>
                  <TokenRow label="" ariaLabel="Search and select roles for email notifications">
                    <SearchDestination options={props.roles} selected={props.selectedEmailRoles} onAdd={props.addEmailRole} placeholder="Search to add roles" />
                  </TokenRow>
                  {props.selectedEmailRoles.length > 0 && (
                    <div className="min-h-[36px] flex flex-wrap gap-2">
                      {props.selectedEmailRoles.map((role) => (
                        <TagToken key={role} text={role} onRemove={() => props.removeEmailRole(role)} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => props.setEmailUsersExpanded(!props.emailUsersExpanded)}
                    className="flex items-center gap-2 text-left hover:text-blue-600 transition-colors"
                  >
                    <h5 className="text-md font-medium text-gray-700">Users</h5>
                    {props.emailUsersExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                  </button>
                  {props.emailUsersExpanded && (
                    <>
                      <TokenRow label="" ariaLabel="Add specific users for email notifications">
                        <SearchDestination options={props.userOptions} selected={props.emailUsers} onAdd={props.addEmailUser} />
                      </TokenRow>
                      {props.emailUsers.length > 0 && (
                        <div className="min-h-[36px] flex flex-wrap gap-2">
                          {props.emailUsers.map((u) => (
                            <TagToken key={u} text={u} onRemove={() => props.removeEmailUser(u)} />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* In-App Section */}
        {visibleChannels.has('inapp') && (
          <div className="space-y-4 border border-gray-300 rounded-lg p-4 bg-gray-50 relative">
            <div className="flex items-center justify-between">
              <button
                onClick={() => props.setInAppExpanded(!props.inAppExpanded)}
                className="flex items-center gap-2 text-left hover:text-blue-600 transition-colors"
              >
                <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <InAppIcon className="text-blue-600" />
                  In-App (Snowsight)
                </h4>
                {props.inAppExpanded ? <ChevronDown className="h-5 w-5 text-gray-500" /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
              </button>
              {visibleChannels.size > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-red-600"
                  onClick={() => removeChannel('inapp')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {props.inAppExpanded && (
              <div className="space-y-4 pl-3">
                <div className="space-y-3">
                  <button
                    onClick={() => props.setInAppRolesExpanded(!props.inAppRolesExpanded)}
                    className="flex items-center gap-2 text-left hover:text-blue-600 transition-colors"
                  >
                    <h5 className="text-md font-medium text-gray-700">Roles</h5>
                    {props.inAppRolesExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                  </button>
                  {props.inAppRolesExpanded && (
                    <>
                      <TokenRow label="" ariaLabel="Search and select roles for in-app notifications">
                        <SearchDestination options={props.roles} selected={props.selectedInAppRoles} onAdd={props.addInAppRole} placeholder="Search to add roles" />
                      </TokenRow>
                      {props.selectedInAppRoles.length > 0 && (
                        <div className="min-h-[36px] flex flex-wrap gap-2">
                          {props.selectedInAppRoles.map((role) => (
                            <TagToken key={role} text={role} onRemove={() => props.removeInAppRole(role)} />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => props.setInAppUsersExpanded(!props.inAppUsersExpanded)}
                    className="flex items-center gap-2 text-left hover:text-blue-600 transition-colors"
                  >
                    <h5 className="text-md font-medium text-gray-700">Users</h5>
                    {props.inAppUsersExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                  </button>
                  {props.inAppUsersExpanded && (
                    <>
                      <TokenRow label="" ariaLabel="Add Snowsight users for in-app notifications">
                        <SearchDestination options={props.userOptions} selected={props.inAppUsers} onAdd={props.addInAppUser} />
                      </TokenRow>
                      {props.inAppUsers.length > 0 && (
                        <div className="min-h-[36px] flex flex-wrap gap-2">
                          {props.inAppUsers.map((u) => (
                            <TagToken key={u} text={u} onRemove={() => props.removeInAppUser(u)} />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* External Section */}
        {visibleChannels.has('external') && (
          <div className="space-y-4 border border-gray-300 rounded-lg p-4 bg-gray-50 relative">
            <div className="flex items-center justify-between">
              <button
                onClick={() => props.setExternalExpanded(!props.externalExpanded)}
                className="flex items-center gap-2 text-left hover:text-blue-600 transition-colors"
              >
                <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                  <ExternalIcon className="text-blue-600" />
                  External
                </h4>
                {props.externalExpanded ? <ChevronDown className="h-5 w-5 text-gray-500" /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
              </button>
              {visibleChannels.size > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-red-600"
                  onClick={() => removeChannel('external')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {props.externalExpanded && (
              <div className="space-y-3 pl-3">
                <TokenRow label="External notification destinations">
                  {props.externalDestinations.map((d) => (
                    <TagToken key={d} text={d} onRemove={() => props.removeExternalDestination(d)} />
                  ))}
                  <AddDestination onAdd={props.addExternalDestination} options={props.externalOptions} />
                </TokenRow>
              </div>
            )}
          </div>
        )}

        {/* More Channels Button */}
        {availableChannels.length > 0 && (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  More channels
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {availableChannels.map((channel) => (
                  <DropdownMenuItem 
                    key={channel.id}
                    onClick={() => addChannel(channel.id)}
                    className="cursor-pointer"
                  >
                    {channel.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  )
}
