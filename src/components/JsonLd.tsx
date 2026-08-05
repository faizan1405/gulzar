import React from 'react';

interface JsonLdProps {
  schema: Record<string, unknown>;
}

export const JsonLd: React.FC<JsonLdProps> = ({ schema }) => {
  const json = JSON.stringify(schema).replace(/<\/script>/g, '<\\/script>');
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
};

export default JsonLd;
