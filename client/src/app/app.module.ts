import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';
import { ChartsModule } from 'ng2-charts';
import {FormsModule} from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';

import { AppComponent } from './app.component';
import { LoginComponent, MaterialDialog } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

import {RouterModule, Routes} from "@angular/router";
import { HomeComponent } from './home/home.component';
import { MatchConfigurationComponent } from './match-configuration/match-configuration.component';
import { MatchInfoComponent } from './match-info/match-info.component';
import {AuthenticationService} from "../services/authentication.service";
import {AuthGuardService as AuthGuard} from "../services/auth-guard.service";
import { NavbarComponent } from './navbar/navbar.component';
import { MatchComponent } from './match/match.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { GameMapComponent } from './match/game-map/game-map.component';
import { RadarComponent } from './match/game-map/radar/radar.component';
import { PlayersMapComponent } from './match/game-map/players-map/players-map.component';
import { MatchLeaderboardComponent } from './match/match-leaderboard/match-leaderboard.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { MatchMultiLeaderboardComponent } from './match/match-multi-leaderboard/match-multi-leaderboard.component';
import { MatchMapComponent } from './match-map/match-map.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { LoadingComponent } from './loading/loading.component';
import { ErrorComponent } from './error/error.component';
import {RoleGuardService as RoleGuard} from "../services/role-guard.service";
import {Role} from "../models/RoleHelper";
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatHint,
  MatIconModule,
  MatInput,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule, MatSlideToggleModule,
  MatSnackBarModule, MatSortModule, MatStepperModule, MatTableModule, MatTabsModule, MatTooltipModule, MatTreeModule
} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";
import { ParticleCanvasComponent } from './particle-canvas/particle-canvas.component';
import { DescriptionComponent } from './home/description/description.component';
import { MatchesListComponent } from './home/matches-list/matches-list.component';
import { BasicMatchInfoComponent } from './match-info/basic-match-info/basic-match-info.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { MatchInfoMapComponent } from './match-info/match-info-map/match-info-map.component';
import { MatchSummaryComponent } from './match/match-summary/match-summary.component';

export enum ComponentName {
  LOGIN = "login",
  REGISTRATION = "registration",
  HOME = "home",
  MATCH_CONFIGURATION = "matchConfiguration",
  MATCH_INFO = "matchInfo",
  MATCH = "match",
  ERROR = "error",
  LOADING = "loading",
  LEADERBOARD = "leaderboard",
  USER_PROFILE = "userProfile",
  MATCH_SUMMARY = "matchSummary"
}


const appRoutes: Routes = [
  {path: "", redirectTo: "home", pathMatch: "full"},
  {path: ComponentName.LOGIN, component: LoginComponent},
  {path: ComponentName.REGISTRATION, component: RegistrationComponent},
  {path: ComponentName.HOME, component: HomeComponent, canActivate: [AuthGuard, RoleGuard],
    data: {standardRole: Role.MANAGER, restrictedRole: Role.VISITOR}},
  {path: ComponentName.MATCH_CONFIGURATION, component: MatchConfigurationComponent, canActivate: [AuthGuard, RoleGuard],
    data: {standardRole: Role.MANAGER, restrictedRole: Role.VISITOR}},
  {path: ComponentName.MATCH_INFO, component: MatchInfoComponent, canActivate: [AuthGuard, RoleGuard],
    data: {standardRole: Role.PLAYER, restrictedRole: Role.VISITOR}},
  {path: ComponentName.MATCH, component: MatchComponent, canActivate: [AuthGuard, RoleGuard],
    data: {standardRole: Role.PLAYER}},
  {path: ComponentName.ERROR, component: ErrorComponent, canActivate: [AuthGuard]},
  {path: ComponentName.LOADING, component: LoadingComponent, canActivate: [AuthGuard]},
  {path: ComponentName.LEADERBOARD, component: LeaderboardComponent, canActivate: [AuthGuard]},
  {path: ComponentName.USER_PROFILE, component: UserProfileComponent, canActivate: [AuthGuard]},
  {path: ComponentName.MATCH_SUMMARY, component: MatchSummaryComponent, canActivate: [AuthGuard]},
];



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    HomeComponent,
    MatchConfigurationComponent,
    MatchInfoComponent,
    NavbarComponent,
    MatchComponent,
    GameMapComponent,
    RadarComponent,
    PlayersMapComponent,
    MatchLeaderboardComponent,
    LeaderboardComponent,
    MatchMultiLeaderboardComponent,
    MatchMapComponent,
    LoadingComponent,
    ErrorComponent,
    ParticleCanvasComponent,
    DescriptionComponent,
    MatchesListComponent,
    BasicMatchInfoComponent,
    UserProfileComponent,
    MaterialDialog,
    MatchInfoMapComponent,
    MatchSummaryComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    ReactiveFormsModule,
    CoreModule,
    ChartsModule,
    BrowserAnimationsModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDu3kkOqXnf2L0xR4ktNS1o31OCCNnIHuk'
      // apiKey: 'AIzaSyCWcppTOQVIT7rzO8GVrtTeTGOqweTjmuc'
    }),
    MatInputModule,
    FlexLayoutModule,
    AgmSnazzyInfoWindowModule,
    MatToolbarModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    ProgressbarModule.forRoot()
  ],
  entryComponents: [MaterialDialog],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
