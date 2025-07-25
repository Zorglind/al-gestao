import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ClientData {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  servicos: number;
  ultimoServico: string;
  foto?: string;
}

export const generateClientPDF = async (client: ClientData) => {
  try {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.text('Sol Lima Tricologia', 20, 30);
    
    pdf.setFontSize(16);
    pdf.text('Ficha do Cliente', 20, 45);
    
    // Client info
    pdf.setFontSize(12);
    pdf.text(`Nome: ${client.nome}`, 20, 65);
    pdf.text(`Telefone: ${client.telefone}`, 20, 80);
    pdf.text(`Email: ${client.email}`, 20, 95);
    pdf.text(`Número de Serviços: ${client.servicos}`, 20, 110);
    pdf.text(`Último Serviço: ${client.ultimoServico}`, 20, 125);
    
    // Footer
    pdf.setFontSize(10);
    pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 280);
    
    // Save
    pdf.save(`ficha-${client.nome.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Falha ao gerar PDF');
  }
};

export const generateExcelTemplate = () => {
  // Simula o download de um template Excel
  const csvContent = `Nome,Telefone,Email,Profissão
Maria Silva,(11) 99999-9999,maria@email.com,Professora
João Santos,(11) 88888-8888,joao@email.com,Engenheiro`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'template-clientes.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return true;
};

export const processExcelImport = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        const clients = lines.slice(1).map((line, index) => {
          const values = line.split(',');
          return {
            id: Date.now() + index,
            nome: values[0]?.trim() || '',
            telefone: values[1]?.trim() || '',
            email: values[2]?.trim() || '',
            profissao: values[3]?.trim() || '',
            servicos: 0,
            ultimoServico: 'Nenhum'
          };
        }).filter(client => client.nome); // Remove empty lines
        
        resolve(clients);
      } catch (error) {
        reject(new Error('Erro ao processar arquivo'));
      }
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsText(file);
  });
};