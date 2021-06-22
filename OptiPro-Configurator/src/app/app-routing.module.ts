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
    data: { showHeader: false, showSidebar: false, showFooter: false, compactLayout: false }
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { showHeader: true, showSidebar: true, showFooter: false, compactLayout: false }
  },
  {
    path: 'preferences',
    component: PreferencesComponent,
    data: { showHeader: true, showSidebar: true, showFooter: false, compactLayout: false }
  },
  {
    path: 'item-code-generation',
    loadChildren: () => import('./features/item-code-generation/item-code-generation.module').then(m => m.ItemCodeGenerationModule),
    data: { showHeader: true, showSidebar: true, showFooter: false, compactLayout: false }
  },
  {
    path: 'dealer-code-generation',
    loadChildren: () => import('./features/User-code-generate/user-code-generation.module').then(m => m.UserCodeGenerationModule),
    data: { showHeader: true, showSidebar: true, showFooter: false, compactLayout: false }
  },
  {
    path: 'feature',
    loadChildren: () => import('./features/feature-model/feature-model.module').then(m => m.FeatureModelModule),
    data: { showHeader: true, showSidebar: true, showFooter: false, compactLayout: false }
  },
  {
    path: 'feature-bom',
    loadChildren: () => import('./features/feature-bom/feature-bom.module').then(m => m.FeatureBOMModule),
    data: { showHeader: true, showSidebar: true, showFooter: false, compactLayout: false }
  },
  {
    path: 'model-bom',
    loadChildren: () => import('./features/model-bom/model-bom.module').then(m => m.ModelBOMModule),
    data: { showHeader: true, showSidebar: true, showFooter: false, compactLayout: false }
  },
  {
    path: 'routing',
    loadChildren: () => import('./features/op-routing/op-routing.module').then(m => m.OpRoutingModule),
    data: { showHeader: true, showSidebar: true, showFooter: false, compactLayout: false }
  },
  {
    path: 'rule-work-bench',
    loadChildren: () => import('./features/rule-work-bench/rule-work-bench.module').then(m => m.RuleWorkBenchModule),
    data: { showHeader: true, showSidebar: true, showFooter: false, compactLayout: false }
  },
  {
    path: 'archive',
    loadChildren: () => import('./features/archiving/archiving.module').then(m => m.ArchivingModule),
    data: { showHeader: true, showSidebar: true, showFooter: false, compactLayout: false }
  },
  {
    path: 'configuration-wizard',
    loadChildren: () => import('./features/configuration-wizard/configuration-wizard.module').then(m => m.ConfigurationWizardModule),
    data: { showHeader: true, showSidebar: true, showFooter: false, compactLayout: false }
  },
  {
    path: 'attribute',
    loadChildren: () => import('./features/attribute/attribute.module').then(m => m.AttributeModule),
    data: { showHeader: true, showSidebar: true, showFooter: false, compactLayout: false }
  },
  {
    path: 'need-assessment',
    loadChildren: () => import('./features/na/na.module').then(m => m.NeedAssessmentModule),
    data: { showHeader: true, showSidebar: true, showFooter: false, compactLayout: false }
  },
  {
    path: 'need-assessment-template',
    loadChildren: () => import('./features/na-temp/na-temp.module').then(m => m.NeedAssessmentTemplateModule),
    data: { showHeader: true, showSidebar: true, showFooter: false, compactLayout: false }
  },
  {
    path: 'need-assessment-rule',
    loadChildren: () => import('./features/na-rule/na-rule.module').then(m => m.NeedAssessmentRuleModule),
    data: { showHeader: true, showSidebar: true, showFooter: false, compactLayout: false }
  },
  {
    path: 'configuration-needAssesment',
    loadChildren: () => import('./features/config-na/Config-na.module').then(m => m.ConfigurationNeedAssesmentModule),
    data: { showHeader: true, showSidebar: true, showFooter: false, compactLayout: false }
  },

  {
    path: 'needAssesment-customer-mapping',
    loadChildren: () => import('./features/ncst-mapping/ncst-mapping.module').then(m => m.NeedsCustomerMappingModule),
    data: { showHeader: true, showSidebar: true, showFooter: false, compactLayout: false }
  },

  {
    path: 'delar-customer-mapping',
    loadChildren: () => import('./features/dcst-mapping/dcst-mapping.module').then(m => m.DelarCustomerMappingModule),
    data: { showHeader: true, showSidebar: true, showFooter: false, compactLayout: false }
  },

  {
    path: 'custom-configure-wizard',
    loadChildren: () => import('./features/custom-cw/custom-cw.module').then(m => m.CustomCWModule),
    data: { showHeader: true, showSidebar: true, showFooter: false, compactLayout: false }
  },

  {
    path: 'material-master',
    loadChildren: () => import('./features/material/material.module').then(m => m.MaterialComponentModule),
    data: { showHeader: true, showSidebar: true, showFooter: false, compactLayout: false }
  }

];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
