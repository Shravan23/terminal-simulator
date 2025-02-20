```mermaid
graph TD
    subgraph Client
        Auth[Authentication UI]
        UI[Terminal UI Component]
        XTerm[XTerm.js Instance]
        FitAddon[Fit Addon]
    end
    subgraph Server
        PTY[Node PTY Process Map]
        MongoDB[(MongoDB)]
        Shell[User Shell Instances]
        UserMgmt[User Management]
    end

    %% Authentication Flow
    Auth -->|Login/Signup| UserMgmt
    UserMgmt -->|Validate| MongoDB
    MongoDB -->|Session Token| Auth

    %% User Input Flow
    Auth -->|Authenticated| UI
    UI -->|User Input| XTerm
    XTerm -->|sendInputToShell| PTY
    PTY -->|User-Specific| Shell

    %% Output Flow
    Shell -->|Generate Output| PTY
    PTY -->|Store with UserId| MongoDB
    MongoDB -->|User-Filtered Publish| UI

    %% Component Relations
    UI -->|Initialize| XTerm
    XTerm -->|Load| FitAddon
    FitAddon -->|Resize Events| XTerm
    PTY -->|Manage Sessions| Shell

    %% Data Collections
    OutputCollection[(OutputCollection)]
    UserCollection[(Meteor.users)]
    MongoDB -->|Terminal Output| OutputCollection
    MongoDB -->|User Data| UserCollection
    OutputCollection -->|User-Filtered Subscribe| UI
    UserCollection -->|Auth State| Auth

    %% Styling
    style UI fill:#f9f,stroke:#333,stroke-width:2px
    style MongoDB fill:#b8d4ff,stroke:#333,stroke-width:2px
    style PTY fill:#b8ffb8,stroke:#333,stroke-width:2px
    style Shell fill:#ffffb8,stroke:#333,stroke-width:2px
    style Auth fill:#ffb8b8,stroke:#333,stroke-width:2px
    style UserMgmt fill:#d8b8ff,stroke:#333,stroke-width:2px
