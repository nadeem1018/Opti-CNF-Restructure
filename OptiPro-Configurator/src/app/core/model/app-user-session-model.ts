

export class AppUserSession {
    // Tenant 
    public TenantId: string
    public TenantName: string
    public TenantType: number
    public TenantIdentityNumber: string
    public SubDomainName: string;
    public PartnerTenantId: string
    public CustomerRefId: string
    public PublisherName: string;
    public PartnerType: number;
    // User
    public TenantUserId: string
    public UserEmail: string
    public UserFullName: string
    public UserType: number
    public PermissionBitMask: number
    public IsAdmin: boolean
    public LastLoginTime: Date
    public UserThumbnailUrl: string
    public Configured: boolean
    public JoinedDate: Date

    // Application
    public CurrentAppId: string
    public ApplicationName: string

    // Localization
    public TimeZone: string = ''
    public Region: string
    public Language: string = ''
    public Currency: string = ''
    public CurrencyCode: number;
    public GroupValue: string = '';
    public GroupSeperator: string = '';
    public DecimalSeperator: string = '';
    public DecimalPrecision:number;
    public DateTimeFormat: string = ''

    // Branding
    public ThemeKey: string
    public TopHeaderLeftLogoUrl: string
    public TopHeaderLeftName: string
    public TopHeaderLeftPortalName: string
    public LeftPoweredBy: string
    public LeftBusinessName: string
    public LeftBusinessLogoUrl: string
    public LeftPartnerName: string
    public ContentCopyrightText: string
    public LandingPageBusinessName: string
    public AppTitle: string;
}


// export class AppUserSession {
//     public AppUserId: string
//     public UserEmail: string
//     public UserName: string
//     public UserThumbnailUrl: string
//     public TenantId: string
//     public TenantName: string
//     public TenantLogoUrl: string
//     public CurrentAppId: string
//     public PermissionBitMask: number
//     public ThemeKey: string
//     public Region: string
//     public Currency: string = ''
//     public Language: string = ''
//     public TimeZone: string = ''
//     public DateTimeFormat: string = ''
//     public CurrentBrowser: string
//     public IsAdmin: boolean
//     public LastLoginTime: Date
//     public ApplicationThumbnailUrl: string;
//     public PublisherLogoUrl: string
//     public PublisherName: string
//     public BusinessLogo: string
//     public Copyright: string
//     public PoweredBy: string
//     public CustomerName: string
//     public UserThumbnailID: string
//     public UserThumbnailFilenname: string
//     public TenantThumbnailID: string
//     public TenantThumbnailFileName: string
//     public AppIdAndNameModelList: Array<AppIdAndNameModel> = [];
//     public ParentRefId: string;
//     public JoinedDate: Date;
//     public SubDomainName: string;
//     public UserType:number;
//     public TenantIdentityNumber: string;
//     public CustomerRefId: string;
//     public Phone:string;
// }