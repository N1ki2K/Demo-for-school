import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { EditableText } from '../../components/cms/EditableText';
import {EditableList } from '../../components/cms/EditableList';

const CouncilPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <PageWrapper title={t.councilPage.title}>
      <div className="space-y-6">
        <EditableText
          id="council-intro"
          defaultContent={t.councilPage.intro}
          tag="p"
        />
        
        <EditableText
          id="council-functions-title"
          defaultContent={t.councilPage.functionsTitle}
          tag="h2"
          className="text-2xl font-semibold text-brand-blue-dark pt-4"
        />
        <EditableList
          id="council-functions"
          defaultItems={[
            t.councilPage.functions.f1,
            t.councilPage.functions.f2,
            t.councilPage.functions.f3,
            t.councilPage.functions.f4,
            t.councilPage.functions.f5
          ]}
          className="list-disc list-inside space-y-2"
        />

        <EditableText
          id="council-members-title"
          defaultContent={t.councilPage.membersTitle}
          tag="h2"
          className="text-2xl font-semibold text-brand-blue-dark pt-4"
        />
        <div className="space-y-4">
          <div>
            <strong>
              <EditableText
                id="council-chairman-role"
                defaultContent={t.councilPage.members.m1.role}
                tag="span"
              />
              :
            </strong>{' '}
            <EditableText
              id="council-chairman-name"
              defaultContent={t.councilPage.members.m1.name}
              tag="span"
            />
          </div>
          <div>
            <strong>
              <EditableText
                id="council-members-role"
                defaultContent={t.councilPage.members.m2.role}
                tag="span"
              />
              :
            </strong>
            <EditableList
              id="council-members-list"
              defaultItems={[
                t.councilPage.members.m2.names.n1,
                t.councilPage.members.m2.names.n2,
                t.councilPage.members.m2.names.n3,
                t.councilPage.members.m2.names.n4
              ]}
              className="list-disc list-inside ml-6 mt-2"
            />
          </div>
        </div>
        <EditableText
          id="council-contact"
          defaultContent={t.councilPage.contact}
          tag="p"
        />
      </div>
    </PageWrapper>
  );
};

export default CouncilPage;