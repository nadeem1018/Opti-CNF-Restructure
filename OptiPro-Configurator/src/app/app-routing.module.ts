import { NgModule } from '@angular/core';
import { ExtraOptions, Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './features/home.component';
import { PreferencesComponent } from './features/preferences/preferences.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'    
  },  
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),    
    data: { showHeader: false, showSidebar: false, showFooter:false, compactLayout:false }
  },
  { path: 'home',
    component: HomeComponent,
    data: { showHeader: true, showSidebar: true, showFooter:false, compactLayout:false }
  }, 
  { path: 'preferences',
    component: PreferencesComponent,
    data: { showHeader: true, showSidebar: true, showFooter:false, compactLayout:false }
  },   
  {
    path: 'item-code-generation',
    loadChildren: () => import('./features/item-code-generation/item-code-generation.module').then(m => m.ItemCodeGenerationModule),    
    data: { showHeader: true, showSidebar: true, showFooter:false, compactLayout:false }
  },
  {
    path: 'feature',
    loadChildren: () => import('./features/feature-model/feature-model.module').then(m => m.FeatureModelModule),    
    data: { showHeader: true, showSidebar: true, showFooter:false, compactLayout:false }
  },
  {
    path: 'feature-bom',
    loadChildren: () => import('./features/feature-bom/feature-bom.module').then(m => m.FeatureBOMModule),    
    data: { showHeader: true, showSidebar: true, showFooter:false, compactLayout:false }
  },
  {
    path: 'model-bom',
    loadChildren: () => import('./features/model-bom/model-bom.module').then(m => m.ModelBOMModule),    
    data: { showHeader: true, showSidebar: true, showFooter:false, compactLayout:false }
  },
  {
    path: 'routing',
    loadChildren: () => import('./features/op-routing/op-routing.module').then(m => m.OpRoutingModule),    
    data: { showHeader: true, showSidebar: true, showFooter:false, compactLayout:false }
  },
  {
    path: 'rule-work-bench',
    loadChildren: () => import('./features/rule-work-bench/rule-work-bench.module').then(m => m.RuleWorkBenchModule),    
    data: { showHeader: true, showSidebar: true, showFooter:false, compactLayout:false }
  },
  {
    path: 'archive',
    loadChildren: () => import('./features/archiving/archiving.module').then(m => m.ArchivingModule),    
    data: { showHeader: true, showSidebar: true, showFooter:false, compactLayout:false }
  },
  {
    path: 'configuration-wizard',
    loadChildren: () => import('./features/configuration-wizard/configuration-wizard.module').then(m => m.ConfigurationWizardModule),    
    data: { showHeader: true, showSidebar: true, showFooter:false, compactLayout:false }
  },
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
