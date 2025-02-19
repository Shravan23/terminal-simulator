```mermaid
graph TD
    subgraph Client
        UI[Terminal UI Component]
        XTerm[XTerm.js Instance]
        FitAddon[Fit Addon]
    end
    subgraph Server
        PTY[Node PTY Process]
        Queue[Bull Queue]
        MongoDB[(MongoDB)]
        Shell[System Shell]
    end

    %% User Input Flow
    UI -->|User Input| XTerm
    XTerm -->|sendInputToShell| PTY
    PTY -->|Write Input| Shell

    %% Output Flow
    Shell -->|Generate Output| PTY
    PTY -->|onData Event| Queue
    Queue -->|Process Job| MongoDB
    MongoDB -->|Publish| UI

    %% Component Relations
    UI -->|Initialize| XTerm
    XTerm -->|Load| FitAddon
    FitAddon -->|Resize Events| XTerm

    %% Data Collections
    Collections[(OutputCollection)]
    MongoDB -->|Store Output| Collections
    Collections -->|Subscribe| UI

    %% Styling
    style UI fill:#f9f,stroke:#333,stroke-width:2px
    style MongoDB fill:#b8d4ff,stroke:#333,stroke-width:2px
    style Queue fill:#ffb8b8,stroke:#333,stroke-width:2px
    style PTY fill:#b8ffb8,stroke:#333,stroke-width:2px
    style Shell fill:#ffffb8,stroke:#333,stroke-width:2px
