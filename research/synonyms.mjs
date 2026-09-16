// The synonym table — one canonical concept per drawing, and every name the
// three reference sets use for it. Read by tools/audit.mjs.
//
// Line format:   canonical   alias alias source:raw-alias ...
//
// Plain aliases are matched AFTER generic normalisation (see normalise() in
// tools/audit.mjs): digits dropped, `slash`→`off`, `xmark`→`x`, trailing
// `-small` dropped, and a leading `circle-`/`square-` container moved to the end
// (`circle-check` → `check-circle`). Write aliases in that normalised form.
//
// `source:raw` aliases match the raw kebab name before normalisation. Use them
// when a name means different things in different sets — Polaris `delete` is a
// trash can, Lucide `delete` is a backspace key.
//
// Canonical names follow the house convention: object first, `-off` for slash.
// A canonical with no aliases is listed only to pin its category.

export const CATEGORIES = {
  arrows:   { label: 'Arrows & Direction',   tier: 1 },
  ui:       { label: 'UI & Layout',          tier: 1 },
  files:    { label: 'Files & Folders',      tier: 1 },
  users:    { label: 'Users & Access',       tier: 1 },
  comms:    { label: 'Communication',        tier: 1 },
  time:     { label: 'Time & Calendar',      tier: 1 },
  status:   { label: 'Status & Feedback',    tier: 1 },
  editing:  { label: 'Editing & Text',       tier: 1 },
  data:     { label: 'Charts & Data',        tier: 1 },
  commerce: { label: 'Commerce & Payments',  tier: 2 },
  media:    { label: 'Media & Playback',     tier: 2 },
  maps:     { label: 'Maps & Location',      tier: 2 },
  devices:  { label: 'Devices & Hardware',   tier: 2 },
  dev:      { label: 'Development & Infra',  tier: 2 },
  design:   { label: 'Design Tools',         tier: 2 },
  other:    { label: 'Tier 3 (on demand)',   tier: 3 },
  // Not ranked. Brand marks are a licensing product, not geometry; platform
  // icons only mean something inside Shopify.
  brands:   { label: 'Logos',                tier: 0 },
  platform: { label: 'Shopify-specific',     tier: 0 },
};

export const CONCEPTS = {
  arrows: `
    arrow-up
    arrow-down
    arrow-left
    arrow-right
    arrow-up-right          arrow-diagonal
    arrow-up-circle         up-circle
    arrow-down-circle       down-circle
    arrow-left-circle       left-circle
    arrow-right-circle      right-circle
    chevron-up
    chevron-down
    chevron-left
    chevron-right
    chevron-up-circle
    chevron-down-circle
    chevron-left-circle
    chevron-right-circle
    chevrons-up-down        select chevron-expand-y
    chevron-first           pagination-start
    chevron-last            pagination-end
    caret-up
    caret-down
    caret-left
    caret-right
    external-link           external arrow-diagonal-out arrow-out-up-right-square arrow-up-right-from-square
    expand
    collapse                shrink
    expand-horizontal       arrows-out-horizontal unfold-horizontal
    collapse-horizontal     arrows-in-horizontal fold-horizontal
    refresh                 refresh-cw lucide:rotate-cw-square
    rotate-ccw              rotate-left
    rotate-cw               rotate-right
    undo                    undo-2
    redo                    redo-2
    reply
    forward
    move
    arrows-swap             exchange arrow-left-right arrow-right-left
    transfer                lucide:arrow-down-up
    corner-down-left        return
    rotate-ccw-dotted       arrow-dotted-rotate-anticlockwise
    merge
  `,

  ui: `
    contrast                dark-light sun-moon
    sun
    moon
    minimize                minimize-2
    maximize                maximize-2 fullscreen full-screen
    sort-alpha-descending   arrow-down-z-a
    sort-descending         sort-desc arrow-down-wide-narrow descending-sorting
    sort-ascending          sort-asc arrow-up-narrow-wide
    sort                    arrow-up-down
    menu
    x                       xmark close
    plus
    minus
    check
    check-double            check-check
    plus-circle
    minus-circle
    plus-square             add-item
    minus-square
    search                  magnifier
    zoom-in                 magnifier-plus
    zoom-out                magnifier-minus
    filter                  funnel
    filter-x                funnel-x
    sliders                 adjust sliders-horizontal sliders-vertical lucide:settings-2
    gear                    settings cog
    more-horizontal         menu-horizontal ellipsis
    more-vertical           menu-vertical ellipsis-vertical
    drag-handle             grip-vertical grip
    drag-handle-horizontal  grip-horizontal
    drag-drop
    home                    house
    grid-3x3                grid-x
    grid                    apps layout-grid grid-2x2 grid-square layout-grid-square rect-layout-grid
    layout-list             grid-list
    layout-dashboard
    columns                 layout-column layout-columns
    rows                    layout-rows
    sidebar                 layout-sidebar-left panel-left
    sidebar-right           layout-sidebar-right panel-right
    layout-header           panel-top
    layout-footer           layout-bottom panel-bottom
    sidebar-close           panel-left-close
    sidebar-open            panel-left-open
    window                  app-window
    popup                   layout-popup picture-in-picture
    checkbox                check-square check-big-square checkbox-checked
    toggle-on               toggle-right nucleo:toggle nucleo:toggle-3
    toggle-off              toggle-left
    toggles
    button
    cursor                  mouse-pointer nucleo:pointer
    cursor-click            button-press mouse-pointer-click
    hand-pointer            lucide:pointer
    form                    forms
    password                rectangle-ellipsis form-input
    pin                     pin-tack
    pin-off
    viewport-wide
    viewport-narrow
    viewport-tall
    viewport-short
    dock-side
    dock-floating
    skeleton
    blank
    focus
    command
    view
    x-square
    hand                    hand-grab grab
    search-empty            magnifier-face-worried
  `,

  files: `
    file                    page
    file-text               file-content
    file-plus               page-add obj-add
    file-minus              page-remove obj-remove
    file-down               page-down
    file-up                 page-up
    file-clock              page-clock
    file-heart              page-heart
    file-check              tasks
    file-attachment         page-attachment
    file-reference          page-reference
    file-search
    file-x
    file-image
    file-video
    file-code
    file-signature          contract file-pen-line
    files                   content
    folder
    folder-open
    folder-plus             folder-add
    folder-minus            folder-remove
    folder-down
    folder-up
    upload                  upload-cloud
    download
    import
    export
    copy                    duplicate
    clipboard
    clipboard-check
    clipboard-list          clipboard-checklist
    clipboard-off
    archive                 box-archive
    trash                   polaris:delete
    attachment              paperclip
    image                   image-mountain
    images
    image-plus              image-add
    image-sparkle           image-magic
    image-alt
    image-explore
    video
    link
    save                    floppy-disk
    note                    sticky-note
    note-plus               note-add sticky-note-plus
    book
    book-open
    book-bookmark
    bookmarks
    categories
    collection
  `,

  users: `
    user                    person user-round
    users                   team users-round
    user-circle             profile user-round-circle
    user-plus               person-add
    user-minus              person-remove
    user-lock               person-lock
    user-exit               person-exit
    user-check
    user-x
    user-search
    user-segment            person-segment
    user-laptop
    user-focus
    user-shield             shield-person
    login                   enter log-in arrow-door-in
    logout                  exit log-out arrow-door-out
    key
    passkey
    lock
    unlock                  lock-open
    shield
    shield-check            shield-check-mark
    shield-off              shield-none
    shield-pending
    eye                     eye-open polaris:view
    eye-off                 hide
    eye-closed
    eye-check               eye-check-mark
    eye-first
    fingerprint
    scan-face               facial-recognition
    id-card                 identity-card
    badge
    badge-check             verified
    vault
    accessibility
  `,

  comms: `
    mail                    email nucleo:envelope
    mail-open               envelope-open
    mail-plus
    mail-follow-up          email-follow-up
    newsletter              email-newsletter
    message                 chat message-circle message-square
    messages                msgs messages-square messages-circle
    message-alert           alert-bubble message-circle-warning message-square-warning
    message-user            msg-bubble-user
    message-smile           msg-smile
    message-pen             msg-writing
    compose                 pen-square compose-circle
    bell                    notification
    bell-off
    bell-plus
    bell-ring
    send                    paper-plane
    phone
    phone-call              phone-volume
    phone-incoming          phone-in
    phone-outgoing          phone-out
    phone-off
    share                   share-2
    at-sign                 mention
    hash                    hashtag
    hash-circle             hashtag-circle
    megaphone               bullhorn
    inbox                   inbox-arrow-down
    headset
    headphones
    microphone              mic
    microphone-off          mic-off
    language                languages
    translate               language-translate
    face-smile              smiley-happy smile
    face-sad                smiley-sad frown
    face-neutral            smiley-neutral meh
    face-laugh              smiley-joy laugh
    face-smile-plus         face-plus smile-plus
    sticker                 sticker-smile
    thumbs-up
    thumbs-down
    rss
  `,

  time: `
    calendar
    calendar-days
    calendar-check
    calendar-plus
    calendar-minus
    calendar-x
    calendar-clock          calendar-time
    clock
    timer
    stopwatch
    history                 rotate-ccw-clock
    hourglass
    alarm-clock
    repeat
  `,

  status: `
    progress-bar
    loader                  loader-circle bar-loader
    check-circle            check-big-circle check-circle-2 status-active
    x-circle
    check-circle-dashed     half-dashed-check-circle half-dotted-check-circle dashed-check-circle
    alert-triangle          triangle-alert triangle-warning alert-warning
    alert-circle            circle-alert warning-circle
    alert-square            warning-square
    alert-octagon           octagon-alert alert-diamond
    info                    info-circle alert-info
    info-square
    help                    question-circle help-circle question-mark-circle alert-question circle-help
    help-square             question-square
    ban                     disabled slash-circle feather:slash
    star
    star-half
    heart
    heart-hand              hand-heart
    flag
    bookmark
    bookmark-off
    sparkle                 magic sparkles stars
    star-sparkle
    award
    award-certificate
    trophy
    gift
    target
    crosshair               crosshairs
    crosshair-off           crosshairs-off
    zap                     bolt-lightning nucleo:bolt
    zap-off                 bolt-off
    lightbulb
    life-buoy               life-ring
    status
    confetti                party-popper
    saved-items
  `,

  editing: `
    link-off                unlink link-break
    pencil                  edit polaris:edit pen edit-2 pen-writing
    pen-sparkle             pencil-sparkles
    scissors                cut
    bold                    text-bold
    italic                  text-italic
    underline               text-underline
    strikethrough
    code
    code-plus               code-add
    quote                   text-quote
    list-bullet             list-bulleted bullet-list unordered-list lucide:list bullet
    list-ordered            list-numbered ordered-list
    list-checks
    text-align-left         align-left text-align-start
    text-align-center       align-center
    text-align-right        align-right text-align-end
    text-align-justify      align-justify
    indent                  text-indent list-indent-increase
    outdent                 list-indent-decrease
    text                    type text-font text-tool
    text-color              baseline
    text-title              heading
    highlighter             text-highlight
    spell-check             text-grammar
    backspace               lucide:delete
    replace
    text-block
    text-in-columns
    text-in-rows
    text-with-image
    text-font-list
    personalized-text
    wand                    magic-wand wand-sparkle wand-sparkles
    signature
    scribble
    remove-background
    blog
  `,

  data: `
    file-chart              file-chart-column file-bar-chart
    list-filter
    chart-bar               chart-vertical chart-column bar-chart chart-bar-axis-x chart-no-axes-column bar-chart-2 bar-chart-3
    chart-bar-horizontal    chart-horizontal lucide:chart-bar
    chart-bar-stacked       chart-stacked chart-column-stacked
    chart-bar-trend         chart-bar-trend-up chart-column-increasing
    chart-line              line-chart chart-popular
    chart-pie               pie-chart chart-donut
    chart-area
    chart-funnel
    chart-cohort
    chart-histogram         chart-histogram-first chart-histogram-first-last chart-histogram-flat chart-histogram-full chart-histogram-growth chart-histogram-last chart-histogram-second-last
    table                   data-table sheet
    calculator
    database
    database-plus           database-add
    database-connect
    trending-up
    trending-down
    activity
    activity-square         activity-chart-square
    gauge
    presentation            data-presentation presentation-screen
    window-chart            window-chart-line
  `,

  commerce: `
    cart                    cart-shopping shopping-cart
    cart-plus               cart-up shopping-cart-plus
    cart-minus              cart-down shopping-cart-minus
    cart-abandoned
    cart-discount
    cart-sale
    shopping-bag            bag-shopping
    shopping-basket         basket-shopping
    store                   shop
    store-online
    store-import
    store-managed
    credit-card             payment
    credit-card-x           credit-card-cancel
    credit-card-lock        credit-card-secure
    credit-card-percent
    card-reader             credit-card-reader credit-card-reader-chip credit-card-reader-tap
    contactless             credit-card-tap-chip
    wallet
    cash                    cash-dollar cash-euro cash-pound cash-rupee cash-yen banknote money-bill-coin
    coins                   money
    money-off               money-none
    receipt                 bill receipt-dollar receipt-euro receipt-pound receipt-rupee receipt-yen receipt-text
    receipt-paid
    receipt-refund
    paper-check
    bank                    landmark
    tag
    tags
    label
    percent                 discount
    discount-code
    gift-card
    ticket
    package                 box nucleo:box
    package-check           package-fulfilled
    package-returned
    package-on-hold
    truck                   delivery
    warehouse               inventory
    inventory-updated
    shipping-label
    label-printer
    envelope-soft-pack      polaris:envelope
    subscription
    scale
    atm                     atm-withdrawal
    point-of-sale
    make-payment
    payout                  payout-dollar payout-euro payout-pound payout-rupee payout-yen
    transaction             transaction-fee-dollar transaction-fee-euro transaction-fee-pound transaction-fee-rupee transaction-fee-yen
    payment-capture
    currency-convert
    finance
    tax
    tip-jar
    reward
    incentive
    affiliate
    referral-code
    price-list
    product
    product-add
    product-remove
    product-cost
    product-list
    product-reference
    product-return
    product-unavailable
    catalog
    order
    order-draft
    order-first
    order-fulfilled
    order-repeat
    order-unfulfilled
    orders-status
    inbound
    outbound
    incoming
    outgoing
    transfer-in
    transfer-out
    transfer-internal
    variant
    briefcase               work suitcase
    building                organization office
    handshake
  `,

  media: `
    play
    pause
    stop
    play-circle
    pause-circle
    stop-circle
    play-circle-dotted      half-dotted-circle-play
    replay
    reset
    skip-forward
    skip-back
    volume                  polaris:sound
    volume-high             volume-up lucide:volume-2
    volume-off              volume-x
    music
    camera
    camera-flip             switch-camera
    film
    slideshow               gallery-horizontal
    live
    cast                    media-receiver
  `,

  maps: `
    map-pin                 location
    map-pin-off             location-none
    map
    compass
    globe                   earth globe-2
    globe-asia
    globe-eu
    globe-pointer
    globe-off
    navigation
    plane                   airplane
    anchor
    roadmap
    domain
    domain-new
    domain-redirect
    domain-landing-page
    dns-settings
    markets                 markets-euro markets-rupee markets-yen
  `,

  devices: `
    desktop                 monitor computer nucleo:computer
    desktop-download        desktop-arrow-down monitor-down
    laptop
    mobile                  smartphone
    tablet
    devices                 laptop-mobile tablet-mobile monitor-smartphone tablet-smartphone
    watch
    keyboard
    keyboard-off            keyboard-hide
    printer                 print
    battery
    battery-full            battery-high
    battery-low
    battery-charging
    plug                    connect
    wifi
    signal
    satellite
    unknown-device
    qr-code                 qrcode
    barcode
    scan
  `,

  dev: `
    bug
    bug-off
    terminal
    server
    cloud
    network                 nodes sitemap
    workflow                automation
    channels
    git-branch
    puzzle                  puzzle-piece app-extension
    component
    rocket
    sandbox
    decision-process
    squares-connected
    webhook
    cpu
    blueprint
    gear-nodes
    wrench
    wrench-screwdriver
    flask                   flask-conical
    microscope
    icons                   icon-name-set
    metafields
  `,

  design: `
    rotation                lucide:rotate-3d
    palette                 color
    color-none
    eyedropper              eye-dropper pipette
    paintbrush              paint-brush-flat paint-brush-round
    pen-tool                pen-nib
    shapes
    layers                  layers-3 layers-2
    stack-perspective
    crop
    flip-horizontal
    flip-vertical
    corner-radius           corner-round radius round-corner-square
    corner-pill
    corner-square
    ruler                   measurement-size
    pencil-ruler            ruler-pen
    compass-drafting        draw-compass drafting-compass
    vector                  vector-square
    aspect-ratio            aspect-ratio-square ratio proportions
    frame
    slash                   lucide:slash
    align-object-left       nucleo:align-3-left align-start-vertical
    align-object-right      nucleo:align-3-right align-end-vertical
    align-object-top        nucleo:align-3-top align-start-horizontal
    align-object-bottom     nucleo:align-3-bottom align-end-horizontal
    align-object-center-h   nucleo:align-3-horizontal align-center-vertical
    align-object-center-v   nucleo:align-3-vertical align-center-horizontal
    image-depth
    image-binary
    filters
    theme
    theme-edit
    theme-store
    theme-template
    favicon
    dotted-arrow-bottom-right-square
    window-expand-bottom-right
    window-key
    window-pointer
    grid-circle-plus
    gem                     gem-sparkle
    droplet
  `,

  other: `
    lamp-desk               desk-lamp
    weight                  measurement-weight
    measurement-volume
    glasses                 eyeglasses
    gamepad                 games gamepad-buttons gaming-buttons
    utensils                food
    leaf                    nature
    flame
    flower
    forklift
    bike                    bicycle
    biceps-flexed           bicep
    fuel                    gas-pump
    coffee                  hot-drink
    pizza                   pizza-slice
    drama                   theatre-masks
    factory                 industry
    graduation-cap
    feather
    drum                    drums
    cookie
    chair                   armchair
    divide
    cloud-rain
    cloud-snow
    cloud-drizzle
    cloud-lightning
    skull
    tree-palm               palmtree
    park
    banana
    rat
    salad
    selfie
    light-switch
    music-sparkle           music-note-sparkle
    cryptography
    interview
    child-head
    phone-rotary
    scissors-coupon
    side-profile
    ufo
    user-long-hair
    user-short-hair
    earth-leaf
    ball-basket
    cubes                   boxes
    yoga
    deer
    energy
    farmer-market
    flower-bouquet
    grapes
    love-music
    lucky-seven
    snapping-fingers
    trumpet
    vacuum-cleaner          robot-vacuum
    watering-plants
    plan
    sports
    iq
    social-ad
    social-post
    shopcodes
    sidekick
    metaobject
    metaobject-list
    metaobject-reference
    collection-featured
    collection-list
    collection-reference
    cursor-banner
    cursor-option
    layout-block
    layout-buy-button
    layout-buy-button-horizontal
    layout-buy-button-vertical
    layout-logo-block
    layout-section
    search-list
    search-recent
    search-resource
    chat-referral
    hashtag-decimal
  `,
};

// Polaris-only concepts that are really Shopify product surface. They are
// ranked out; listed here rather than in `other` so the report can name them.
export const PLATFORM = `
  sidekick shopcodes metafields metaobject metaobject-list metaobject-reference
  collection collection-featured collection-list collection-reference
  cursor-banner cursor-option layout-block layout-buy-button
  layout-buy-button-horizontal layout-buy-button-vertical layout-logo-block
  layout-section theme-store theme-template markets iq sports social-ad
  social-post chat-referral hashtag-decimal search-list search-resource
  product product-add product-remove product-cost product-list
  product-reference product-return product-unavailable catalog order
  order-draft order-first order-fulfilled order-repeat order-unfulfilled
  orders-status inbound outbound incoming outgoing transfer-in transfer-out
  transfer-internal variant inventory-updated shipping-label label-printer
  envelope-soft-pack payment-capture make-payment point-of-sale price-list
  affiliate referral-code incentive tip-jar tax finance payout transaction
  domain domain-new domain-redirect domain-landing-page dns-settings favicon
  icons blank skeleton eye-first file-reference image-alt image-explore
  personalized-text text-font-list image-with-text-overlay text-with-image text-in-columns
  text-in-rows text-block dock-side dock-floating unknown-device
  store-online store-import store-managed cart-abandoned cart-discount
  cart-sale discount-code gift-card paper-check receipt-paid package-returned
  package-on-hold order-repeat chart-cohort chart-histogram database-connect
  globe-asia globe-eu money-off color-none corner-pill corner-square
  remove-background theme theme-edit plan measurement-volume
`;

// Names that extend another concept's name without being its variant — the
// prefix match would otherwise credit chevrons-up with chevrons-up-down.
export const NOT_VARIANT = `
  chevrons-up-down map-pin arrow-up-right arrow-up-left arrow-down-right
  arrow-down-left pencil-ruler hand-pointer book-open
`;

// Brand marks — tier 0 regardless of count.
export const BRAND_PREFIX = 'logo-';

// Lucide deprecated aliases that collide with a generic concept and would
// award false credit: `grid` is on grid-3x3, `text` on text-align-start,
// `edit` on square-pen, `layout` on panels-top-left.
export const LUCIDE_ALIAS_IGNORE = ['grid', 'text', 'edit', 'layout'];

// D23's 122 bases, mapped onto canonical concepts. Doc 04 uses subject-first
// names in places (`bar-chart`); the audit uses the house convention.
export const D23 = {
  arrows: 'arrow-up arrow-down arrow-left arrow-right chevron-up chevron-down chevron-left chevron-right caret-up caret-down caret-left caret-right external-link expand collapse refresh undo redo',
  ui: 'menu close:x search filter sort grid list:layout-list columns sidebar maximise:maximize minimise:minimize more-h:more-horizontal more-v:more-vertical drag-handle gear sliders plus minus check x',
  files: 'file file-text folder folder-open upload download copy archive trash attachment image video link export',
  users: 'user users user-circle login logout key lock unlock shield eye eye-off badge',
  comms: 'mail mail-open message chat:messages bell bell-off send phone share at:at-sign megaphone inbox',
  time: 'calendar calendar-days clock timer history stopwatch hourglass alarm:alarm-clock repeat schedule:calendar-clock',
  status: 'check-circle x-circle alert-triangle alert-circle info help loading:loader star heart flag bookmark sparkle',
  editing: 'pencil duplicate:copy cut:scissors bold italic underline code quote list-ordered list-bullet align-left:text-align-left align-center:text-align-center align-right:text-align-right link-break:link-off',
  data: 'bar-chart:chart-bar line-chart:chart-line pie-chart:chart-pie table database trending-up trending-down activity filter-data:list-filter report:file-chart',
};
