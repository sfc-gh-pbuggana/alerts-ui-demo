import React from 'react'

interface IconProps {
  className?: string
}

export const HomeIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 16 16" role="presentation" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g>
      <path fill="currentColor" fillRule="evenodd" d="M7.36 2.247c.406-.19.877-.188 1.282.005l4.504 2.146c.521.25.854.777.854 1.355V12.5a1.5 1.5 0 0 1-1.5 1.5H9v-4H7v4H3.5A1.5 1.5 0 0 1 2 12.5V5.708a1.5 1.5 0 0 1 .864-1.358zm.85.907a.5.5 0 0 0-.426 0l-4.496 2.1A.5.5 0 0 0 3 5.709V12.5a.5.5 0 0 0 .5.5H6V9.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V13h2.5a.5.5 0 0 0 .5-.5V5.753a.5.5 0 0 0-.285-.451z" clipRule="evenodd" />
    </g>
  </svg>
)

export const PlusIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M8.5 7.5H14v1H8.5V14h-1V8.5H2v-1h5.5V2h1z" fill="currentColor" />
  </svg>
)

export const SearchIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 16 16" role="presentation" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g>
      <path fill="currentColor" fillRule="evenodd" d="M7 2a5 5 0 0 1 3.871 8.164l3.983 3.983-.707.707-3.983-3.983A5 5 0 1 1 7 2m0 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8" clipRule="evenodd" />
    </g>
  </svg>
)

export const WorkspacesIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 16 16" role="presentation" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g>
      <path fill="currentColor" d="M8.5 15h-1V9H3V8a2 2 0 0 0 2-2V2H4V1h8v1h-1v4a2 2 0 0 0 2 2v1H8.5z" />
    </g>
  </svg>
)

export const NotebooksIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 16 16" role="presentation" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g>
      <path fill="currentColor" d="M8.5 15h-1V9H3V8a2 2 0 0 0 2-2V2H4V1h8v1h-1v4a2 2 0 0 0 2 2v1H8.5z" />
    </g>
  </svg>
)

export const ProjectsIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 16 16" role="presentation" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g>
      <g fill="currentColor">
        <path d="M11 11H7v-1h4zM8.207 8l-2.853 2.854-.708-.707L6.793 8 4.646 5.854l.708-.708z" />
        <path fillRule="evenodd" d="M12.5 2A1.5 1.5 0 0 1 14 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12.5v-9A1.5 1.5 0 0 1 3.5 2zm-9 1a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z" clipRule="evenodd" />
      </g>
    </g>
  </svg>
)

export const IngestionIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 16 16" role="presentation" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g>
      <g fill="currentColor">
        <path d="M8 6.499c.133 0 .26.055.354.148l3 3-.707.707L8.5 8.207V14h-1V8.207l-2.146 2.146-.708-.707 3-2.999A.5.5 0 0 1 8 6.5" />
        <path d="M7.936 2.005a3.97 3.97 0 0 1 3.73 3.468A3.533 3.533 0 0 1 15 9l-.004.176a3.534 3.534 0 0 1-3.348 3.352l-.012.001-.156.004H11v-1h.454l.151-.004a2.53 2.53 0 0 0 2.382-2.278L14 9c0-1.312-.997-2.39-2.274-2.52l-.26-.013q-.114 0-.225.01l-.546.047.002-.547v-.019a2.966 2.966 0 0 0-2.813-2.954L7.73 3a2.967 2.967 0 0 0-2.966 2.967l.006.194q.019.289.09.56l.184.7-.72-.076A2.1 2.1 0 0 0 2 9.434l.01.214a2.1 2.1 0 0 0 2.09 1.885H5v1h-.9a3.1 3.1 0 0 1-3.096-2.94L1 9.433a3.1 3.1 0 0 1 2.785-3.085A3.967 3.967 0 0 1 7.731 2z" />
      </g>
    </g>
  </svg>
)

export const TransformationIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 16 16" role="presentation" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g>
      <path fill="currentColor" fillRule="evenodd" d="M14 2a1 1 0 0 1 1 1v3a1 1 0 0 1-.898.995L14 7h-3l-.102-.005a1 1 0 0 1-.893-.892L10 6V5H9a.5.5 0 0 0-.5.5V7c0 .385-.146.734-.385 1 .239.266.385.615.385 1v1.5a.5.5 0 0 0 .5.5h1v-1a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-.898.995L14 14h-3l-.102-.005a1 1 0 0 1-.893-.893L10 13v-1H9a1.5 1.5 0 0 1-1.5-1.5V9a.5.5 0 0 0-.5-.5H6v1a1 1 0 0 1-.897.995L5 10.5H2l-.103-.005a1 1 0 0 1-.892-.892L1 9.5v-3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1h1a.5.5 0 0 0 .5-.5V5.5A1.5 1.5 0 0 1 9 4h1V3a1 1 0 0 1 1-1zm-3 11h3v-3h-3zM2 9.5h3v-3H2zM11 6h3V3h-3z" clipRule="evenodd" />
    </g>
  </svg>
)

export const AIMLIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 16 16" role="presentation" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g>
      <g fill="currentColor">
        <path fillRule="evenodd" d="M11.347 9.026a.491.491 0 0 1 .918 0 3.92 3.92 0 0 0 2.141 2.216l.2.078.065.023a.496.496 0 0 1 0 .935l-.207.08a3.97 3.97 0 0 0-2.19 2.314.498.498 0 0 1-.902.077l-.034-.077a3.98 3.98 0 0 0-2.398-2.394l-.077-.034a.497.497 0 0 1 .077-.9l.065-.024a3.93 3.93 0 0 0 2.26-2.097zm.459 1.289a4.9 4.9 0 0 1-1.544 1.503c.623.395 1.15.923 1.544 1.547a5 5 0 0 1 1.543-1.547 4.9 4.9 0 0 1-1.543-1.503M5.395 1.53c.258-.707 1.26-.707 1.517 0a6.46 6.46 0 0 0 3.864 3.86c.708.257.708 1.257 0 1.515l-.332.13a6.46 6.46 0 0 0-3.532 3.728c-.241.663-1.137.704-1.46.124l-.057-.124a6.46 6.46 0 0 0-3.863-3.858l-.125-.057c-.582-.323-.54-1.218.125-1.459a6.46 6.46 0 0 0 3.731-3.527zm.759.79a7.45 7.45 0 0 1-3.831 3.826 7.45 7.45 0 0 1 3.83 3.826 7.45 7.45 0 0 1 3.83-3.826 7.45 7.45 0 0 1-3.83-3.825" clipRule="evenodd" />
        <path d="M14 3h1v1h-1v1h-1V4h-1V3h1V2h1z" />
      </g>
    </g>
  </svg>
)

export const MonitoringIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 16 16" role="presentation" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g>
      <path fill="currentColor" d="M6.013 2a.5.5 0 0 1 .445.3l3.565 10.143 2.028-5.162.035-.061A.5.5 0 0 1 12.5 7H15v1h-2.187l-2.364 5.853a.5.5 0 0 1-.907-.018L5.97 3.678 3.947 8.724A.5.5 0 0 1 3.5 9H1V8h2.191l2.362-5.723.037-.062A.5.5 0 0 1 6.013 2" />
    </g>
  </svg>
)

export const MarketplaceIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 16 16" role="presentation" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g>
      <path fill="currentColor" fillRule="evenodd" d="M13.5 2a.5.5 0 0 1 .48.362l.462 1.616c.178.62.377 1.359.401 2.069.025.72-.127 1.479-.72 2.072q-.06.058-.123.112V12.5a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1-.5-.5V11H7v2.5a.5.5 0 0 1-.5.5h-3A1.5 1.5 0 0 1 2 12.5V8.231q-.064-.054-.124-.112c-.592-.593-.745-1.352-.72-2.072.025-.71.224-1.448.401-2.07l.462-1.615.03-.077A.5.5 0 0 1 2.498 2zM10 8.23a2.98 2.98 0 0 1-4 0 2.98 2.98 0 0 1-3 .595V12.5a.5.5 0 0 0 .5.5H6v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V13h2.5a.5.5 0 0 0 .5-.5V8.825a2.98 2.98 0 0 1-3-.596M2.52 4.251c-.18.63-.345 1.257-.365 1.83-.02.561.102 1.004.429 1.331a1.993 1.993 0 0 0 2.916-.1V5h1v2.312c.367.42.9.688 1.5.688.598 0 1.132-.267 1.5-.687V5h1v2.312a1.993 1.993 0 0 0 2.916.102c.326-.328.448-.77.428-1.333-.02-.572-.184-1.2-.364-1.83L13.123 3H2.877z" clipRule="evenodd" />
    </g>
  </svg>
)

export const CatalogIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 16 16" role="presentation" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g>
      <path fill="currentColor" fillRule="evenodd" d="M8.001 2c1.303 0 2.509.263 3.406.71.868.434 1.595 1.126 1.595 2.039q0 .086-.008.169.008.09.008.182v5.822l-.006.134v.011l-.002.011c-.08.923-.767 1.658-1.646 2.143-.782.43-1.783.704-2.874.766L8 14.001c-1.315 0-2.53-.307-3.433-.83C3.678 12.659 3 11.873 3 10.902V5.1q0-.095.008-.186A2 2 0 0 1 3 4.75c0-.912.727-1.605 1.595-2.038C5.492 2.263 6.697 2 8 2m4.001 4.427a4 4 0 0 1-.595.36c-.897.447-2.103.71-3.406.71-1.304 0-2.509-.262-3.406-.71A4 4 0 0 1 4 6.426V10.9c0 .464.33.98 1.068 1.407.726.419 1.762.694 2.933.694l.419-.012c.962-.055 1.813-.296 2.445-.644.732-.404 1.089-.898 1.131-1.348l.006-.118zM8.001 3c-1.17 0-2.207.275-2.933.694-.633.366-.966.798-1.047 1.205.073.305.371.668 1.021.993.731.365 1.777.605 2.959.605s2.228-.24 2.959-.605c.65-.325.946-.688 1.02-.993-.081-.407-.413-.839-1.046-1.205-.635-.366-1.508-.623-2.5-.681z" clipRule="evenodd" />
    </g>
  </svg>
)

export const DataSharingIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 16 16" role="presentation" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fill="currentColor" fillRule="evenodd" d="M13.492 8.205a5.5 5.5 0 0 0-3.027-4.623 2.5 2.5 0 0 0-4.93 0 5.5 5.5 0 0 0-3.027 4.623 2.5 2.5 0 1 0 2.03 4.57A5.48 5.48 0 0 0 8 14c1.312 0 2.516-.46 3.461-1.225a2.5 2.5 0 1 0 2.031-4.57M3.527 8a4.5 4.5 0 0 1 2.07-3.306 2.501 2.501 0 0 0 4.805 0A4.5 4.5 0 0 1 12.472 8a2.5 2.5 0 0 0-1.846 4.155A4.48 4.48 0 0 1 8 13a4.48 4.48 0 0 1-2.626-.845A2.5 2.5 0 0 0 3.527 8M8 2.5a1.498 1.498 0 0 0-1.48 1.749A1.5 1.5 0 1 0 8 2.5m-6 8A1.497 1.497 0 0 1 3.527 9 1.5 1.5 0 1 1 2 10.5M12.5 12q-.124 0-.241-.02A1.5 1.5 0 0 1 11 10.5a1.5 1.5 0 1 1 1.5 1.5" clipRule="evenodd" />
  </svg>
)

export const GovernanceSecurityIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 16 16" role="presentation" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g>
      <path fill="currentColor" d="M13 4.35 8 2.53 3 4.35V8c0 1.496 1.194 2.865 2.556 3.917a15 15 0 0 0 2.431 1.522l.013.005.013-.005a15 15 0 0 0 2.432-1.521C11.805 10.864 13 9.495 13 8zM14 8c0 2.004-1.556 3.636-2.944 4.708a16 16 0 0 1-2.78 1.715l-.05.023-.013.006-.004.002-.001.001h-.001a.5.5 0 0 1-.312.034l-.102-.034h-.002l-.004-.003-.014-.006-.05-.023-.183-.09a16 16 0 0 1-2.596-1.625C3.556 11.636 2 10.004 2 8V4a.5.5 0 0 1 .33-.47l5.5-2a.5.5 0 0 1 .34 0l5.5 2A.5.5 0 0 1 14 4z" />
    </g>
  </svg>
)

export const ComputeIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 16 16" role="presentation" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g>
      <path fill="currentColor" d="M9.112 1.184a.5.5 0 0 1 .885.366L9.55 6H13a.5.5 0 0 1 .387.815l-6.5 8a.5.5 0 0 1-.884-.365L6.448 10H3a.5.5 0 0 1-.388-.816zM4.049 9H7a.5.5 0 0 1 .498.55l-.335 3.34L11.95 7H9a.5.5 0 0 1-.497-.55l.334-3.342z" />
    </g>
  </svg>
)

export const AdminIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 16 16" role="presentation" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g>
      <path fill="currentColor" d="M10.518 6.759a3.76 3.76 0 0 0-4.065-3.747L8.48 5.038a.5.5 0 0 1 0 .707L5.746 8.48a.5.5 0 0 1-.708 0L3.012 6.453Q3 6.603 3 6.76a3.76 3.76 0 0 0 4.897 3.582l.068-.017a.5.5 0 0 1 .437.14l2.683 2.682-.707.707L7.9 11.377c-.366.09-.748.142-1.141.142a4.76 4.76 0 0 1-4.527-6.23.5.5 0 0 1 .83-.2l2.33 2.33 2.026-2.026-2.33-2.33a.5.5 0 0 1 .2-.83 4.76 4.76 0 0 1 6.23 4.526c0 .394-.052.776-.142 1.141l2.478 2.478-.707.707-2.683-2.683a.5.5 0 0 1-.123-.505c.114-.359.177-.74.177-1.137" />
    </g>
  </svg>
)
